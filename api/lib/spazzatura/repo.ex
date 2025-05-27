defmodule Spazzatura.Repo do
  use Ecto.Repo,
    otp_app: :spazzatura,
    adapter: Ecto.Adapters.Postgres
end
