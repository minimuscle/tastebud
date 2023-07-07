import { redirect, type LoaderFunction, json } from '@remix-run/node'
export const loader: LoaderFunction = async () => {
  return redirect('/all')
}

export default function Index() {
  return null
  //This may dp something in the future, but for now it will just redirect to the "all" category. Possibly it should save last session
}
