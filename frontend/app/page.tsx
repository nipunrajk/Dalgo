export default function HomePage() {
  return (
    <section className='mt-8'>
      <h1 className='text-4xl font-semibold'>Welcome to My Dashboard</h1>
      <p className='mt-4 text-slate-600'>
        This is the landing page. Use the top navigation to register, login and
        open the dashboard.
      </p>
      <div className='mt-6 space-x-3'>
        <a
          href='/login'
          className='inline-block px-4 py-2 bg-sky-600 text-white rounded'
        >
          Login
        </a>
        <a
          href='/register'
          className='inline-block px-4 py-2 border border-slate-200 rounded'
        >
          Register
        </a>
      </div>
    </section>
  );
}
