Rails.application.routes.draw do
  root to: 'static_pages#root'
  namespace :api, defaults: { format: :json } do
    resources :stores, only: [:index, :show] do
      collection do
        get 'search'
        get 'filters'
        post 'main_map'
        get 'browse_search'
        get 'most_visited'
        get 'trending'
        post 'most'
        get 'auto_complete'
      end
    end

    resources :inspections, only: [:index, :show]
    resources :violations, only: [:index, :show]
    resources :yelps, only: [:show]
  end
end
