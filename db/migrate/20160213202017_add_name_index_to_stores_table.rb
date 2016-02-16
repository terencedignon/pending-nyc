class AddNameIndexToStoresTable < ActiveRecord::Migration
  def change
    add_index :stores, :name
    add_index :stores, :zipcode
    add_index :stores, :boro
  end
end
