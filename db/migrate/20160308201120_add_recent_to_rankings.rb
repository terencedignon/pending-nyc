class AddRecentToRankings < ActiveRecord::Migration
  def change
    add_column :rankings, :recent, :string
  end
end
