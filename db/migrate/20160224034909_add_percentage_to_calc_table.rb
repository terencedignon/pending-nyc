class AddPercentageToCalcTable < ActiveRecord::Migration
  def change
        add_column :calcs, :mice_percentage, :integer
        add_column :calcs, :roach_percentage, :integer
        add_column :calcs, :flies_percentage, :integer
  end
end
