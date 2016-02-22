class AddScoreToCalc < ActiveRecord::Migration
  def change
    add_column :calcs, :score, :integer
    add_column :calcs, :last, :integer
  end
end
