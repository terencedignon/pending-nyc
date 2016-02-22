class AddYelpDataToStoresTable < ActiveRecord::Migration
  def change
    add_column :stores, :snippet_text, :string
    add_column :stores, :image_url, :string
    add_column :stores, :neighborhoods, :string
    add_column :stores, :display_phone, :string
    add_column :stores, :yelp_url, :string
    add_column :stores, :display_address, :string

  end
end
