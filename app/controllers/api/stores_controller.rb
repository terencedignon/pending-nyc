class Api::StoresController < ApplicationController

  def index
    @stores = Store.all.includes(:inspections, :violations, :calcs).limit(50)
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
