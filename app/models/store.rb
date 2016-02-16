class Store < ActiveRecord::Base

  has_one :calc
  has_many :inspections
  has_many :violations, through: :inspections, source: :violations

end
