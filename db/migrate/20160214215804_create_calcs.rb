class CreateCalcs < ActiveRecord::Migration
  def change
    create_table :calcs do |t|
      t.integer :inspections
      t.integer :violations
      t.integer :critical
      t.integer :mice
      t.integer :flies
      t.integer :roaches
      t.integer :first_average
      t.integer :average
      t.integer :worst
      t.datetime :worst_date
      t.integer :best
      t.datetime :best_date
      t.integer :store_id
      t.timestamps null: false
    end
  end
end
