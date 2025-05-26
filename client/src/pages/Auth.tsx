import { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router'

type FormData = {
  userType: string
  cpf: string
  cnpj: string
  password: string
  reminder: boolean
}

function Auth() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    userType: 'coletor',
    cpf: '',
    cnpj: '',
    password: '',
    reminder: false,
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    console.log(formData)
    e.preventDefault()

    switch (formData.userType) {
      case 'coletor':
        navigate('/dashboard/coletor', { replace: true })
        break
      case 'comercio':
        navigate('/dashboard/comercio', { replace: true })
        break
      case 'cooperativa':
        navigate('/dashboard/cooperativa', { replace: true })
        break

      default:
        break
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLSelectElement

    const fieldValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }))
  }

  return (
    <main>
      <h1>Spazzatura</h1>
      <span>Sistema de gestão de coleta de recicláveis</span>

      <form action="" method="post" onSubmit={handleSubmit}>
        <label htmlFor="userType">
          Tipo de usuário
          <select name="userType" id="userType" onChange={handleChange}>
            <option value="coletor">Coletor</option>
            <option value="comercio">Comércio</option>
            <option value="cooperativa">Cooperativa</option>
          </select>
        </label>
        {(formData.userType === 'comercio' ||
          formData.userType === 'cooperativa') && (
          <>
            <label htmlFor="cnpj">CNPJ</label>
            <input type="text" name="cnpj" id="cnpj" onChange={handleChange} />
          </>
        )}
        {formData.userType === 'coletor' && (
          <>
            <label htmlFor="cpf">CPF</label>
            <input
              type="text"
              maxLength={14}
              name="cpf"
              id="cpf"
              onChange={handleChange}
            />
          </>
        )}
        <label htmlFor="password">Senha</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handleChange}
        />
        <label htmlFor="reminder">Lembrar-me</label>
        <input
          type="checkbox"
          name="reminder"
          id="reminder"
          onChange={handleChange}
        />
        <input type="submit" value="Entrar" />
      </form>
    </main>
  )
}

export default Auth
