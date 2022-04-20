import { Avatar, Box, Text, Flex, FlexProps, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, useColorModeValue, VStack, Link, MenuDivider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  FiMenu,
  FiBell,
  FiChevronDown,
} from 'react-icons/fi';
import { useWallet } from "../contexts/walletContext";
import Blockies from 'react-blockies';

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
export const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const wallet = useWallet();

  const [address, setAddress] = useState<string>();

  useEffect(() => {
    async function resolveAddress() {
      const ensName = await wallet.provider.lookupAddress(wallet.account);
      if (ensName != null) {
        setAddress(ensName);
      }
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
                <Avatar size={'sm'} >
                  <Blockies seed={wallet.account} />
                </Avatar>
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
