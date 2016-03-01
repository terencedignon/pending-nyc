class AddRankingsToMacroCalc < ActiveRecord::Migration
  def change
    add_column :macro_calcs, :rankings, :string
  end
end
