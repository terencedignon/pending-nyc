json.array!(violations) do |violation|
  debugger
  json.partial!('violation', violation: violation)
end
