class Ranking < ActiveRecord::Base
  serialize :worst, Array
  serialize :average, Array
  serialize :first_average, Array
  serialize :mice, Array
  serialize :flies, Array
  serialize :roaches, Array
  serialize :score, Array
  serialize :recent, Array

  belongs_to :macro_calc

end
