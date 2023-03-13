import { useState, useEffect } from 'react'
import {
  Button,
  Container,
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
  Text,
} from '@chakra-ui/react'
import { MdArrowBack } from 'react-icons/md'
import { Field, Form, Formik, useFormik } from 'formik'
import * as yup from 'yup'

export default function NewLocation(props) {
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    console.log(props.result)

    if (props.result) setDisabled(true)
  }, [props.result])

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size='xl' isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Button leftIcon={<MdArrowBack />} m={4} onClick={props.onClose}>
            Back
          </Button>
          Add a new location!
        </ModalHeader>
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
        <ModalFooter>
          <Button m={4} colorScheme='blue'>
            Save
          </Button>
          <Button onClick={props.onClose}>Close</Button>
        </ModalFooter>
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
