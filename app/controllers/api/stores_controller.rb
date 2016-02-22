class Api::StoresController < ApplicationController

  def index
    if params[:map_query] || params[:main]
      south = params[:bounds][:south]
      north = params[:bounds][:north]
      east = params[:bounds][:east]
      west = params[:bounds][:west]

      if params[:main]
        @stores = Store.where("lat BETWEEN ? AND ? AND lng BETWEEN ? AND ?", south, north, west, east)

        params[:query].each do |query|
          @stores = @stores.where("lower(#{query[0]}) LIKE ?", "%" + query[1] + "%")

        end
        @stores = @stores.includes(:calc).limit(100)
        render :index
      else
        cuisine_type = params[:cuisine_type]

        @stores = Store.where("cuisine_type = ? AND (lat BETWEEN ? AND ?) AND (lng BETWEEN ? AND ?)", cuisine_type, south, north, west, east).includes(:calc).limit(100)
        render :index
      end
    else
      @stores = Store.all.includes(:inspections, :violations, :calcs).limit(100)
      render :index
    end
  end

  def main_map
    south = params[:bounds][:south]
    north = params[:bounds][:north]
    east = params[:bounds][:east]
    west = params[:bounds][:west]
    @stores = Store.where("lat BETWEEN ? AND ? AND lng BETWEEN ? AND ?", south, north, west, east)

    # params[:query].each do |query|
      # @stores = @stores.where("#{query[0]} LIKE ?", "%" + query[1].to_s + "%")

    # end
    @stores = @stores.ransack(name_cont: params[:query][:name],
                  zipcode_start: params[:query][:zipcode],
                  boro_cont: params[:query][:boro],
                  cuisine_type_cont: params[:query][:cuisine_type]
                  ).result.includes(:calc).order(created_at: :desc).limit(500)


    # @stores = @stores.includes(:calc).limit(100)
    render :index

  end

  def show
    @store = Store.find(params[:id])
    @store.update!(last_visit: Time.now, visit_count: @store.visit_count + 1)
    @store
  end

  def filters
    boro = Store.all.map { |store| store.boro }.uniq
    zipcode = Store.all.map { |store| store.zipcode }.uniq
    cuisine_type = Store.all.map { |store| store.cuisine_type}.uniq

    object = { boro: boro, zipcode: zipcode, cuisine_type: cuisine_type}
    render json: object
  end

  def browse_search
    query = params[:query]

    @stores = Store.where("#{query[0]} LIKE ?", "%" + query[1] +  "%")
    render json: @stores.includes(:calcs)
  end

  def trending
    @stores = Store.all.order(last_visit: :desc).limit(5)
    render :index
  end

  def most_visited
    @stores = Store.all.order(visit_count: :desc).limit(5)
    render :index
  end

  def search
    search = params[:q]
    search_result = Store.ransack(name_cont: search).result.includes(:calc)
    @stores = search_result.limit(100)
    render json: @stores
    # render "api/stores/index"
  end

end
