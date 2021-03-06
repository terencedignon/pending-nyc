require 'open-uri'

namespace :store_data do



  desc "Perform calculations on Store data"

  # task change_to_percent: :environment do
  #   Store.all.includes(:calc).each do |store|
  #     p store.id
  #     store.calc.update(
  #       mice: store.calc.mice == 0 ? 0 : (store.calc.mice / store.calc.inspections) * 100,
  #       roaches: store.calc.roaches == 0 ? 0 : (store.calc.roaches / store.calc.roaches) * 100,
  #       flies: store.calc.flies == 0 ? 0 : (store.calc.flies / store.calc.flies) * 100
  #     )
  #   end
  # end

  ###add function that removes errant stores


  task yelp_sandbox: :environment do
    Store.all.each do |store|
      query = Yelp.client.phone_search(store.phone)
      debugger
    end

  end

  task set_street_macro: :environment do
    streets = Store.all.map { |store| store.street }.uniq


    streets.each do |street|

      mice = 0
      flies = 0
      stores = 0
      roaches = 0
      inspections = 0
      violations = 0
      critical = 0
      first_average = []
      average = []
      worst_average = 0
      worst_average_id = nil
      worst_first_average = 0
      worst_first_average_id = nil
      worst = 0
      worst_id = nil

      Store.where(street: street).includes(:calc).each do |store|
        next unless store.calc
        stores += 1
        mice += store.calc.mice
        flies += store.calc.flies
        roaches += store.calc.roaches
        inspections += store.calc.inspections
        violations += store.calc.violations
        critical += store.calc.critical
        first_average.push(store.calc.first_average)
        average.push(store.calc.average)
        if store.calc.first_average > worst_first_average
          worst_first_average = store.calc.first_average
          worst_first_average_id = store.id
        end
        if store.calc.average > worst_average
          worst_average = store.calc.average
          worst_average_id = store.id
        end
        if store.calc.worst > worst
          worst = store.calc.worst
          worst_id = store.id
        end
      end

      MacroCalc.create(
        name: street,
        inspections: inspections,
        stores: stores,
        mice: mice,
        flies: flies,
        roaches: roaches,
        first_average: first_average.inject(:+) / first_average.length,
        average: average.inject(:+) / average.length,
        violations: violations,
        critical: critical,
        worst: worst,
        worst_id: worst_id,
        worst_average: worst_average,
        worst_average_id: worst_average_id,
        worst_first_average: worst_first_average,
        worst_first_average_id: worst_first_average_id
      )


    end
  end

  task set_rankings: :environment do
    MacroCalc.all.each do |macro|

      score = Store.ransack(boro_or_cuisine_type_or_street_or_zipcode_eq: macro.name).result.includes(:calc).order("calcs.score ASC")
                .map{ |store| store.calc.score }
      average = Store.ransack(boro_or_cuisine_type_or_street_or_zipcode_eq: macro.name).result.includes(:calc).order("calcs.average ASC")
                .map{ |store| store.calc.average }
      first_average = Store.ransack(boro_or_cuisine_type_or_street_or_zipcode_eq: macro.name).result.includes(:calc).order("calcs.first_average ASC")
                .map{ |store| store.calc.first_average }
      flies = Store.ransack(boro_or_cuisine_type_or_street_or_zipcode_eq: macro.name).result.includes(:calc).order("calcs.flies_percentage ASC")
                .map{ |store| store.calc.flies_percentage }
      roach = Store.ransack(boro_or_cuisine_type_or_street_or_zipcode_eq: macro.name).result.includes(:calc).order("calcs.roach_percentage ASC")
                .map{ |store| store.calc.roach_percentage}
      mice = Store.ransack(boro_or_cuisine_type_or_street_or_zipcode_eq: macro.name).result.includes(:calc).order("calcs.mice_percentage ASC")
                .map{ |store| store.calc.mice_percentage }

      worst = Store.ransack(boro_or_cuisine_type_or_street_or_zipcode_eq: macro.name).result.includes(:calc).order("calcs.worst ASC")
                          .map{ |store| store.calc.worst }


      recent = Store.ransack(boro_or_cuisine_type_or_street_or_zipcode_eq: macro.name).result.includes(:calc).order("calcs.last ASC")
                          .map{ |store| store.calc.last }

      Ranking.create(macro_calc_id: macro.id,  recent: recent, worst: worst, score: score, average: average, first_average: first_average,
        flies: flies, roaches: roach, mice: mice)
    end
  end

  task set_last: :environment do
    Store.includes(:calc).each do |store|
      last_inspection = store.inspections.order(inspection_date: :desc)
      score = (last_inspection.first.score ? last_inspection.first.score : last_inspection.second.score)
      grade = (last_inspection.first.grade ? last_inspection.first.grade : last_inspection.second.grade)

      store.calc.update(last: score, grade: grade)

    end
  end

  task set_case: :environment do
    Store.all.each do |store|
      if store.cuisine_type =~ /Latin/
        # debugger
        store.update(cuisine_type: "Latin")
      end
    end

    # Store.all.each do |store|
      # p store.id if store.id % 1000 == 0
      #
      # street = store.street.split(" ").map(&:capitalize).join(" ")
      # boro = store.boro.split(" ").map(&:capitalize).join(" ")
      # cuisine = store.cuisine_type
      # if store.cuisine_type
      #   cuisine = store.cuisine_type.split(" ").map(&:capitalize).join("")
      #
      #
      # end

      # store.update(cuisine_type: cuisine)
    # end
  end

  task rankings: :environment do
    MacroCalc.all.each do |macro|
      store_collection = Store.includes(:calc).where(zipcode: macro.name) + Store.where(boro: macro.name) + Store.where(cuisine_type: macro.name)
      sorted = store_collection.sort_by { |store| store.calc.worst }.map { |store| store.id }
      macro.update!(
        rankings: sorted
      )
    end
  end

  task geocode: :environment do
    Store.all.select { |store| store.lng.to_s == "-74.0444" }.each do |store|
      p store.lat.to_s
      query = "#{store.building}+#{store.street.split(" ").join("+")},+#{store.boro.split(" ").join("+")},+NY"

      data = JSON.load(open("https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&key=AIzaSyCeMPHcWvEYRmPBI5XyeBS9vPsAvqxLD7I"))

      next if data["results"] == []
      lat = data["results"][0]["geometry"]["location"]["lat"]
      lng = data["results"][0]["geometry"]["location"]["lng"]

      store.update!(
        lat: lat,
        lng: lng
      )
      p store.lat.to_s
      p "-"
    end
  end



  task add_macro_score: :environment do
    MacroCalc.all.each do |macro|
      score = [
        (macro.mice / macro.inspections.to_f) * 100,
        (macro.roaches / macro.inspections.to_f) * 100,
        (macro.flies / macro.inspections.to_f) * 100,
        macro.average,
        macro.first_average,
      ].inject(:+) / 5
      macro.update(score: score.round)
    end

  end

  task add_overall_score: :environment do
    Store.all.each do |store|
      # next if store.id < 11360
      next if store.calc.nil?

      p store.id
      last = store.inspections.map{|inspection| inspection.score}.reject{|n| n.nil?}.first

      score = [
        store.calc.mice_percentage,
        store.calc.roach_percentage,
        store.calc.flies_percentage,
        store.calc.average,
        last,
        store.calc.first_average,
        store.calc.best,
        store.calc.worst
      ].inject(:+) / 8.to_f


      store.calc.update(last: last, score: score.round)

    end

  end



  task coords: :environment do
    Store.all.each do |store|
      p store.id
      next if store.id < 8069 || store.phone.nil? || store.phone.to_i.to_s != store.phone.to_s || store.phone.length != 10
      query = Yelp.client.phone_search(store.phone).businesses[0]
      if query

        longitude = query.location.coordinate.longitude
        latitude = query.location.coordinate.latitude
        store.update!(
        lat: latitude,
        lng: longitude,
        display_address: query.location.display_address,
        snippet_text: query.snippet_text,
        yelp_url: query.url,
        image_url: query.image_url,
        display_phone: query.display_phone,
        neighborhoods: query.location.neighborhoods
        )



        # add_column :stores, :rating_image_url, :string
        # add_column :stores, :image_url, :string
        # add_column :stores, :rating_image_url_large, :string
        # add_column :stores, :neighborhoods, :string
        # add_column :stores, :cross_streets, :string
        # add_column :stores, :display_phone, :string
        # add_column :stores, :yelp_url, :string
        # add_column :stores, :display_address, :string
      end
    end

  end

  task  populate_macro_data: :environment do

    zipcode_store = Store.order(zipcode: :desc).map do |store|
      store.zipcode
    end.uniq
    boro_store = Store.order(boro: :desc).map do |store|
      store.boro
    end.uniq
    cuisine_store = Store.order(cuisine_type: :desc).map do |store|
      store.cuisine_type
    end.uniq

    boro_store.each do |boro|
      mice = 0
      flies = 0
      stores = 0
      roaches = 0
      inspections = 0
      violations = 0
      critical = 0
      first_average = []
      average = []
      worst_average = 0
      worst_average_id = nil
      worst_first_average = 0
      worst_first_average_id = nil
      worst = 0
      worst_id = nil

      Store.where(boro: boro).includes(:calc).each do |store|
        next unless store.calc
        stores += 1
        mice += store.calc.mice
        flies += store.calc.flies
        roaches += store.calc.roaches
        inspections += store.calc.inspections
        violations += store.calc.violations
        critical += store.calc.critical
        first_average.push(store.calc.first_average)
        average.push(store.calc.average)
        if store.calc.first_average > worst_first_average
          worst_first_average = store.calc.first_average
          worst_first_average_id = store.id
        end
        if store.calc.average > worst_average
          worst_average = store.calc.average
          worst_average_id = store.id
        end
        if store.calc.worst > worst
          worst = store.calc.worst
          worst_id = store.id
        end
      end

      MacroCalc.create(
        name: boro,
        inspections: inspections,
        stores: stores,
        mice: mice,
        flies: flies,
        roaches: roaches,
        first_average: first_average.inject(:+) / first_average.length,
        average: average.inject(:+) / average.length,
        violations: violations,
        critical: critical,
        worst: worst,
        worst_id: worst_id,
        worst_average: worst_average,
        worst_average_id: worst_average_id,
        worst_first_average: worst_first_average,
        worst_first_average_id: worst_first_average_id
      )

    end


    cuisine_store.each do |cuisine_type|
      mice = 0
      flies = 0
      stores = 0
      roaches = 0
      inspections = 0
      violations = 0
      critical = 0
      first_average = []
      average = []
      worst_average = 0
      worst_average_id = nil
      worst_first_average = 0
      worst_first_average_id = nil
      worst = 0
      worst_id = nil

      Store.where(cuisine_type: cuisine_type).includes(:calc).each do |store|
        next unless store.calc
        stores += 1
        mice += store.calc.mice
        flies += store.calc.flies
        roaches += store.calc.roaches
        inspections += store.calc.inspections
        violations += store.calc.violations
        critical += store.calc.critical
        first_average.push(store.calc.first_average)
        average.push(store.calc.average)
        if store.calc.first_average > worst_first_average
          worst_first_average = store.calc.first_average
          worst_first_average_id = store.id
        end
        if store.calc.average > worst_average
          worst_average = store.calc.average
          worst_average_id = store.id
        end
        if store.calc.worst > worst
          worst = store.calc.worst
          worst_id = store.id
        end
      end

      MacroCalc.create(
        name: cuisine_type,
        inspections: inspections,
        stores: stores,
        mice: mice,
        flies: flies,
        roaches: roaches,
        first_average: first_average.inject(:+) / first_average.length,
        average: average.inject(:+) / average.length,
        violations: violations,
        critical: critical,
        worst: worst,
        worst_id: worst_id,
        worst_average: worst_average,
        worst_average_id: worst_average_id,
        worst_first_average: worst_first_average,
        worst_first_average_id: worst_first_average_id
      )

    end

    zipcode_store.each do |zipcode|
      mice = 0
      flies = 0
      stores = 0
      roaches = 0
      inspections = 0
      violations = 0
      critical = 0
      first_average = []
      average = []
      worst_average = 0
      worst_average_id = nil
      worst_first_average = 0
      worst_first_average_id = nil
      worst = 0
      worst_id = nil

      Store.where(zipcode: zipcode).includes(:calc).each do |store|
        next unless store.calc
        stores += 1
        mice += store.calc.mice
        flies += store.calc.flies
        roaches += store.calc.roaches
        inspections += store.calc.inspections
        violations += store.calc.violations
        critical += store.calc.critical
        first_average.push(store.calc.first_average)
        average.push(store.calc.average)
        if store.calc.first_average > worst_first_average
          worst_first_average = store.calc.first_average
          worst_first_average_id = store.id
        end
        if store.calc.average > worst_average
          worst_average = store.calc.average
          worst_average_id = store.id
        end
        if store.calc.worst > worst
          worst = store.calc.worst
          worst_id = store.id
        end
      end

      MacroCalc.create(
        name: zipcode,
        inspections: inspections,
        stores: stores,
        mice: mice,
        flies: flies,
        roaches: roaches,
        first_average: first_average.inject(:+) / first_average.length,
        average: average.inject(:+) / average.length,
        violations: violations,
        critical: critical,
        worst: worst,
        worst_id: worst_id,
        worst_average: worst_average,
        worst_average_id: worst_average_id,
        worst_first_average: worst_first_average,
        worst_first_average_id: worst_first_average_id
      )

    end


  end

  task stores: :environment do
    Store.all.each_with_index do |store, i|
      next if store.inspections.length == 1 && store.inspections[0].score == nil
      puts "#{store.id} => #{i}"
      initial_inspections = []
      all_inspections = []
      critical = 0
      mouse_count = 0
      fly_count = 0
      roach_count = 0

      worst = 0
      worst_date = nil
      best = 10000
      best_date = nil
      violation_count = 0
      score_divisor = store.inspections.select { |inspection| inspection.score }.length
      first_score_divisor = store.inspections.select { |inspection| inspection.score && inspection.inspection_type =~ /Initial Inspection/ }.length
      inspection_count = store.inspections.length
      store.inspections.each do |inspect|
        mouse = false
        fly = false
        roach = false

        if inspect.score && inspect.score > worst
          worst = inspect.score
          worst_date = inspect.inspection_date
        end

        if inspect.score && inspect.score < best
          best = inspect.score
          best_date = inspect.inspection_date
        end

        initial_inspections.push(inspect.score) if inspect.score && inspect.inspection_type =~ /Initial Inspection/
        all_inspections.push(inspect.score) if inspect.score
        inspect.violations.each do |violation|
          violation_count += 1
          critical += 1 if violation.critical
          mouse = true if violation.description =~ /mice/
          fly = true if violation.description =~ /flies/
          roach = true if violation.description =~ /roaches/
        end
        mouse_count += 1 if mouse
        fly_count += 1 if fly
        roach_count += 1 if roach
      end


      calc = Calc.create(
      store_id: store.id,
      violations: violation_count,
      inspections: inspection_count,
      first_average: (initial_inspections.inject(:+) / first_score_divisor.to_f),
      average: (all_inspections.inject(:+) / score_divisor.to_f),
      mice: mouse_count,
      mice_percentage: (mouse_count == 0 ? mouse_count : ((mouse_count / inspection_count.to_f) * 100)),
      roach_percentage: (roach_count == 0 ? roach_count : ((roach_count / inspection_count.to_f) * 100)),
      flies_percentage: (fly_count == 0 ? fly_count : ((fly_count / inspection_count.to_f) * 100)),
      flies: fly_count,
      roaches: roach_count,
      critical: critical,
      worst: worst,
      worst_date: worst_date,
      best: best,
      best_date: best_date
      )

    end


  end
end
