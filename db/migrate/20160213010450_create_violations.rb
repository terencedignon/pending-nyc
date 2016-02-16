class CreateViolations < ActiveRecord::Migration
  def change
    create_table :violations do |t|
      t.string :description
      t.integer :inspection_id
      t.string :code
      t.boolean :critical

      t.timestamps null: false
    end
  end
end
