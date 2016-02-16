class ChangeBuildingToString < ActiveRecord::Migration
  def change
    change_column :stores, :street, :integer, default: ""
  end
end
