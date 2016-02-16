class CreateInspections < ActiveRecord::Migration
  def change
    create_table :inspections do |t|
      t.integer :store_id, null: false
      t.datetime :inspection_date
      t.string :grade, default: "z"
      t.datetime :grade_date
      t.datetime :record_date
      t.integer :score
      t.string :action, default: ""

      t.timestamps null: false
    end
  end
end
