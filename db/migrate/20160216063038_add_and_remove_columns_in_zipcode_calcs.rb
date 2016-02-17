class AddAndRemoveColumnsInZipcodeCalcs < ActiveRecord::Migration
  def change
    remove_column :zipcode_calcs, :median
    remove_column :zipcode_calcs, :median_first
    remove_column :zipcode_calcs, :worst_store_id
    remove_column :zipcode_calcs, :zipcode
    add_column :zipcode_calcs, :name, :string
    add_column :zipcode_calcs, :worst_id, :integer
    add_column :zipcode_calcs, :worst_average, :integer
    add_column :zipcode_calcs, :worst_average_id, :integer
    add_column :zipcode_calcs, :worst_first_average, :integer
    add_column :zipcode_calcs, :worst_first_average_id, :integer
rename_table :zipcode_calcs, :macro_calcs
  end
end
