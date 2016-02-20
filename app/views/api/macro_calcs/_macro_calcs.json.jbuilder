json.macro_calc do
  break if calc.nil?
    json.extract!(macro_calc, :inspections, :violations, :critical,
  :mice, :flies, :roaches, :first_average, :average, :worst,
  :worst_date, :best, :best_date)
end
