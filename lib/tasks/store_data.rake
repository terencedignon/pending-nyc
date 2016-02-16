namespace :store_data do
  desc "Perform calculations on Store data"
  task stores: :environment do
    Store.all.each_with_index do |store, i|
      next if store.inspections.length == 1 && store.inspections[0].score == nil
      puts store.id
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
      p initial_inspections

      calc = Calc.create(
      store_id: store.id,
      violations: violation_count,
      inspections: inspection_count,
      first_average: (initial_inspections.inject(:+) / initial_inspections.length.to_f),
      average: (all_inspections.inject(:+) / all_inspections.length.to_f),
      mice: mouse_count,
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
