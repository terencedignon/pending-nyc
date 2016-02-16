class AddIndexToStoreAndInspectionTables < ActiveRecord::Migration
  def change
    add_index :stores, :camis
    add_index :inspections, :inspection_date
    add_index :inspections, :store_id
    add_index :violations, :inspection_id
    add_index :stores, :zipcode
    add_index :stores, :boro 
  end
end
