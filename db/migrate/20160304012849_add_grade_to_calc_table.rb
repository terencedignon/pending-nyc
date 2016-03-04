class AddGradeToCalcTable < ActiveRecord::Migration
  def change
    add_column :calcs, :grade, :string
  end
end
