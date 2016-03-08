class RemoveRankingFromMacroCalc < ActiveRecord::Migration
  def change

    remove_column :macro_calcs, :rankings, :string

  end
end
