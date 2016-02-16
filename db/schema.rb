# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160216051628) do

  create_table "calc", force: :cascade do |t|
    t.integer  "inspections"
    t.integer  "violations"
    t.integer  "critical"
    t.integer  "mice"
    t.integer  "flies"
    t.integer  "roaches"
    t.integer  "first_average"
    t.integer  "average"
    t.integer  "worst"
    t.datetime "worst_date"
    t.integer  "best"
    t.datetime "best_date"
    t.integer  "store_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "calcs", force: :cascade do |t|
    t.integer  "inspections"
    t.integer  "violations"
    t.integer  "critical"
    t.integer  "mice"
    t.integer  "flies"
    t.integer  "roaches"
    t.integer  "first_average"
    t.integer  "average"
    t.integer  "worst"
    t.datetime "worst_date"
    t.integer  "best"
    t.datetime "best_date"
    t.integer  "store_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "inspections", force: :cascade do |t|
    t.integer  "store_id",                      null: false
    t.datetime "inspection_date"
    t.string   "grade",           default: "z"
    t.datetime "grade_date"
    t.datetime "record_date"
    t.integer  "score"
    t.string   "action",          default: ""
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.string   "inspection_type", default: ""
  end

  add_index "inspections", ["inspection_date"], name: "index_inspections_on_inspection_date"
  add_index "inspections", ["store_id"], name: "index_inspections_on_store_id"

  create_table "stores", force: :cascade do |t|
    t.string   "building",     default: ""
    t.string   "name",         default: ""
    t.integer  "camis",                     null: false
    t.string   "phone",        default: ""
    t.string   "street",       default: ""
    t.integer  "zipcode",                   null: false
    t.string   "boro"
    t.string   "cuisine_type", default: ""
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  add_index "stores", ["boro"], name: "index_stores_on_boro"
  add_index "stores", ["camis"], name: "index_stores_on_camis"
  add_index "stores", ["name"], name: "index_stores_on_name"
  add_index "stores", ["zipcode"], name: "index_stores_on_zipcode"

  create_table "violations", force: :cascade do |t|
    t.string   "description"
    t.integer  "inspection_id"
    t.string   "code"
    t.boolean  "critical"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "violations", ["inspection_id"], name: "index_violations_on_inspection_id"

end
