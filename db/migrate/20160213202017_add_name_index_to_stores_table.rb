class AddNameIndexToStoresTable < ActiveRecord::Migration
  def change
    add_index :stores, :name

  end
end
