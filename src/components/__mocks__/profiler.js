// we have this mock here so the profiler doesn't actually
// attempt to send profile reports during tests.
const Profiler = ({children}) => children

export {Profiler}
