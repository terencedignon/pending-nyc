class CreateRankings < ActiveRecord::Migration
  def change
    create_table :rankings do |t|

      t.integer :macro_calc_id

      t.string :average
      t.string :score
      t.string :first_average
      t.string :mice
      t.string :roaches
      t.string :flies
      t.string :worst

      t.timestamps null: false
    end
  end
end
