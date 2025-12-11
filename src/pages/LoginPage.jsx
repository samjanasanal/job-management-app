import LoginForm from "../components/auth/LoginForm"

function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black">
      <img
        src="/images/8450ab4967f4a0d166aeedfca0d29f836ba4be4c.gif"
        alt="Background animation"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 w-full max-w-md">
        {/* Logo */}
        <h1 className="text-white text-4xl md:text-5xl tracking-wider">LOGO</h1>

        {/* Login Form */}
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
