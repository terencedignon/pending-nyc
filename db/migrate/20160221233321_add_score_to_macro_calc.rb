class AddScoreToMacroCalc < ActiveRecord::Migration
  def change
    add_column :macro_calcs, :score, :integer
  end
end
