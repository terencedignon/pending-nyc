class RemoveCalcDouble < ActiveRecord::Migration
  def change
    drop_table :calc
  end
end
