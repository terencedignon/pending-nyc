class Inspection < ActiveRecord::Base

  has_many :violations
  belongs_to :store

end
