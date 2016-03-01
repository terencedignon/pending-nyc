class MacroCalc < ActiveRecord::Base
  serialize :rankings, Array
  belongs_to :store
end
