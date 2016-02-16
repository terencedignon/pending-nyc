class SecondGoAtChangingStreetToString < ActiveRecord::Migration
  def change
    change_column :stores, :street, :string, default: ""
  end
end
