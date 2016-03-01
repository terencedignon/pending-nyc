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

ActiveRecord::Schema.define(version: 20160301023359) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

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
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.integer  "score"
    t.integer  "last"
    t.integer  "mice_percentage"
    t.integer  "roach_percentage"
    t.integer  "flies_percentage"
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

  add_index "inspections", ["inspection_date"], name: "index_inspections_on_inspection_date", using: :btree
  add_index "inspections", ["store_id"], name: "index_inspections_on_store_id", using: :btree

  create_table "macro_calcs", force: :cascade do |t|
    t.integer  "stores"
    t.integer  "inspections"
    t.integer  "violations"
    t.integer  "critical"
    t.integer  "mice"
    t.integer  "flies"
    t.integer  "roaches"
    t.integer  "first_average"
    t.integer  "average"
    t.integer  "worst"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "name"
    t.integer  "worst_id"
    t.integer  "worst_average"
    t.integer  "worst_average_id"
    t.integer  "worst_first_average"
    t.integer  "worst_first_average_id"
    t.integer  "score"
    t.string   "rankings"
  end

  create_table "stores", force: :cascade do |t|
    t.string   "building",                                default: ""
    t.string   "name",                                    default: ""
    t.integer  "camis",                                                      null: false
    t.string   "phone",                                   default: ""
    t.string   "street",                                  default: ""
    t.integer  "zipcode",                                                    null: false
    t.string   "boro"
    t.string   "cuisine_type",                            default: ""
    t.datetime "created_at",                                                 null: false
    t.datetime "updated_at",                                                 null: false
    t.decimal  "lng",             precision: 9, scale: 6, default: -74.0444
    t.decimal  "lat",             precision: 9, scale: 6, default: 40.6892
    t.datetime "last_visit"
    t.integer  "visit_count",                             default: 0
    t.string   "snippet_text"
    t.string   "image_url"
    t.string   "neighborhoods"
    t.string   "display_phone"
    t.string   "yelp_url"
    t.string   "display_address"
  end

  add_index "stores", ["boro"], name: "index_stores_on_boro", using: :btree
  add_index "stores", ["camis"], name: "index_stores_on_camis", using: :btree
  add_index "stores", ["name"], name: "index_stores_on_name", using: :btree
  add_index "stores", ["zipcode"], name: "index_stores_on_zipcode", using: :btree

  create_table "violations", force: :cascade do |t|
    t.string   "description"
    t.integer  "inspection_id"
    t.string   "code"
    t.boolean  "critical"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "violations", ["inspection_id"], name: "index_violations_on_inspection_id", using: :btree

end
