class Api::StoresController < ApplicationController

  def index
    if params[:map_query]
      south = params[:bounds][:south]
      north = params[:bounds][:north]
      east = params[:bounds][:east]
      west = params[:bounds][:west]
      cuisine_type = params[:cuisine_type]

      @stores = Store.where("cuisine_type = ? AND (lat BETWEEN ? AND ?) AND (lng BETWEEN ? AND ?)", cuisine_type, south, north, west, east).includes(:calc)
      render :index
    else
      @stores = Store.all.includes(:inspections, :violations, :calcs).limit(50)
      render :index
    end
  end

  def show
    @store = Store.find(params[:id])
  end

  def search
    search = params[:q]
    search_result = Store.ransack(name_cont: search).result
    @stores = search_result
    render "api/stores/index"
  end

end
