import { Box, BoxProps, CloseButton, Flex, FlexProps, Icon, Link, Text, useColorModeValue } from "@chakra-ui/react";
import { ReactText } from "react";
import { IconType } from "react-icons";
import {
  FiHome,
  FiLink,
} from 'react-icons/fi';

interface LinkItemProps {
  name: string;
  icon: IconType;
  target: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, target: "#/home" },
  { name: 'Linked Accounts', icon: FiLink, target: "#/linked_accounts"},
];

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'teal.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('teal.200', 'teal.900')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Spuris
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} target={link.target}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  target: string;
}
const NavItem = ({ icon, target, children, ...rest }: NavItemProps) => {
  return (
    <Link href={target} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'teal.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};
