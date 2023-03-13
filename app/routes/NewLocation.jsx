import { useState, useEffect } from 'react'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import * as yup from 'yup'

export default function NewLocation(props) {
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    console.log(props.result)
    if (props.result) setDisabled(true)
  }, [props.result])

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size='xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a new location!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              location: props.result ? props.result.text : '',
              address: props.result ? props.result.place_name : '',
            }}
          >
            {(props) => (
              <Form>
                <Field name='location'>
                  {({ field, form }) => (
                    <FormControl>
                      <FormLabel>Location Name</FormLabel>
                      <Input {...field} placeholder={form.values.location} />
                      <FormErrorMessage>
                        {form.errors.location}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name='address'>
                  {({ field, form }) => (
                    <FormControl>
                      <FormLabel>Address</FormLabel>
                      <Input
                        {...field}
                        placeholder={form.values.address}
                        isDisabled={disabled}
                      />
                      <FormErrorMessage>{form.errors.address}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button
                  mt={4}
                  colorScheme='teal'
                  isLoading={props.isSubmitting}
                  type='submit'
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}

//Form to add
/*
input - Name
input - Address

the above inputs will be disabled if choosing one from the dropdown, but the name should be editable if you are using the map

multiselect for food items

add location button
*/
