class Store < ActiveRecord::Base

  has_one :calc
  has_one(
    :zipcode_calc,
    class_name: "MacroCalc",
    foreign_key: :name,
    primary_key: :zipcode
  )

  has_one(
    :boro_calc,
    class_name: "MacroCalc",
    foreign_key: :name,
    primary_key: :boro
  )

  has_one(
    :cuisine_calc,
    class_name: "MacroCalc",
    foreign_key: :name,
    primary_key: :cuisine_type
  )


  has_many :inspections
  has_many :violations, through: :inspections, source: :violations

end
