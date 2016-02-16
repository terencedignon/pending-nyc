class Api::YelpsController < ApplicationController
  def show
    @yelp = Yelp.client.phone_search(params[:id])
  end
end
