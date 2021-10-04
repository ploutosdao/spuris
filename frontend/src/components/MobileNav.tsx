import { Avatar, Box, Text, Flex, FlexProps, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, useColorModeValue, VStack, Link, MenuDivider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  FiMenu,
  FiBell,
  FiChevronDown,
} from 'react-icons/fi';
import { useWallet } from "../contexts/walletContext";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
export const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const wallet = useWallet();

  const [address, setAddress] = useState<string>();

  useEffect(() => {
    async function resolveAddress() {
      const ensName = await wallet.provider.lookupAddress(wallet.account);
      setAddress(ensName);
    }
    if (wallet.account && wallet.account !== "") {
      resolveAddress();
    } else {
      setAddress("");
    }
  }, [wallet.account]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"

      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        Spuris
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{address}</Text>
                  <Text fontSize="xs" color="gray.600">

                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <Link href="#/profile" ><MenuItem>Profile</MenuItem></Link>
              <MenuItem>Settings</MenuItem>
              
              {wallet.status === 'connected' && (<>
                <MenuDivider />
                <MenuItem onClick={() => wallet.disconnect()}>Disconnect</MenuItem>
              </>) }
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
