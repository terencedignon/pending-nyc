class MacroCalc < ActiveRecord::Base
  # serialize :rankings, Array
  has_one :ranking
  belongs_to :store
end
