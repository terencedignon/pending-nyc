class CreateZipcodeCalcs < ActiveRecord::Migration
  def change
    create_table :zipcode_calcs do |t|
      t.integer :zipcode
      t.integer :stores
      t.integer :inspections
      t.integer :violations
      t.integer :critical
      t.integer :mice
      t.integer :flies
      t.integer :roaches
      t.integer :first_average
      t.integer :average
      t.integer :median
      t.integer :median_first
      t.integer :worst
      t.integer :worst_store_id

      t.timestamps null: false
    end
  end
end
