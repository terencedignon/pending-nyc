json.calc do
  break if calc.nil?
  json.extract!(calc, :inspections, :violations, :critical,
:mice, :flies, :roaches, :ranking, :first_average, :average, :worst,
:worst_date, :best, :best_date)
end
