import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Heading,
  Skeleton,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useNavigate } from '@remix-run/react'
// import Rating from 'react-rating'

export default function NoLocationPopup({
  isOpen,
  onClose,
  fetchData,
}: {
  isOpen: boolean
  onClose: () => void
  fetchData: any
}) {
  const navigate = useNavigate()
  return (
    <Card
      size="sm"
      display={isOpen ? 'true' : 'none'}
      m={'-175px 125px 0 -125px'}
    >
      <CardBody>
        {fetchData.state === 'idle' ? (
          <>
            <Heading size="md">{fetchData.data?.name}:</Heading>
            <Text
              fontStyle={'italic'}
              fontSize="md"
            >
              Location not found
            </Text>
            <Text
              mt="5px"
              fontSize="md"
            >
              Do you want to create it?
            </Text>
          </>
        ) : (
          <Stack>
            <Skeleton height="20px" />
            <Skeleton height="10px" />
            <Skeleton
              mt="5px"
              height="10px"
            />
          </Stack>
        )}

        {/* <Text fontSize="md">{fetchData.state}</Text> */}
        <ButtonGroup mt="10px">
          <Button
            colorScheme="green"
            isLoading={fetchData.state !== 'idle'}
            onClick={() => {
              console.log('Add Location')
              navigate(`/new/${fetchData.data?.place_id}`)
            }}
          >
            Add Location
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ButtonGroup>
      </CardBody>
    </Card>
  )
}
