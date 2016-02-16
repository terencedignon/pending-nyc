json.calc do
  json.extract!(calc, :inspections, :violations, :critical,
:mice, :flies, :roaches, :first_average, :average, :worst,
:worst_date, :best, :best_date)
end
