class AddLngAndLatToStore < ActiveRecord::Migration
  def change
    add_column :stores, :lng, :decimal, precision: 9, scale: 6, default: -74.0444
    add_column :stores, :lat, :decimal, precision: 9, scale: 6, default: 40.6892
  end
end
