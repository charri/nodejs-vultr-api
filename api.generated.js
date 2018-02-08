const Rest = require('./rest.js');
class Account {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Retrieve information about the current account.
	 *
	 * @return {Promise}
	 */
	info () {
		return this.rest.execute('/v1/account/info', true, 'GET');
	}
}
class Application {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Retrieve a list of available applications. These refer to applications that can be launched when creating a Vultr VPS.
	 *
	 * @return {Promise}
	 */
	list () {
		return this.rest.execute('/v1/app/list', false, 'GET');
	}
}
class APIKey {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Retrieve information about the current API key.
	 *
	 * @return {Promise}
	 */
	info () {
		return this.rest.execute('/v1/auth/info', true, 'GET');
	}
}
class Backup {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * List all backups on the current account.
	 *
	 * @param {Integer} subid (optional) Filter result set to only contain backups of this subscription object.
	 * @param {String} backupid (optional) Filter result set to only contain this backup.
	 * @return {Promise}
	 */
	list (subid, backupid) {
		let payload = { };
		if(subid !== undefined) { payload['SUBID'] = subid; }
		if(backupid !== undefined) { payload['BACKUPID'] = backupid; }
		return this.rest.execute('/v1/backup/list', true, 'GET', payload);
	}
}
class BareMetal {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Reinstalls the baremetal server to a different Vultr one-click application. All data will be permanently lost.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/baremetal/list call.
	 * @param {Integer} appid Application to use. See /v1/baremetal/app_change_list.
	 * @return {Promise}
	 */
	app_change (subid, appid) {
		let payload = {'SUBID' : subid, 'APPID' : appid };
		return this.rest.execute('/v1/baremetal/app_change', true, 'POST', payload);
	}
	/**
	 * Retrieves a list of Vultr one-click applications to which a baremetal server can be changed. Always check against this list before trying to switch applications because it is not possible to switch between every application combination.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/baremetal/list call.
	 * @return {Promise}
	 */
	app_change_list (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/baremetal/app_change_list', true, 'GET', payload);
	}
	/**
	 * Get the bandwidth used by a baremetal server.
	 *
	 * @return {Promise}
	 */
	bandwidth () {
		return this.rest.execute('/v1/baremetal/bandwidth', true, 'GET');
	}
	/**
	 * Create a new baremetal server. You will start being billed for this immediately. The response only contains the SUBID for the new machine.
	 *
	 * @param {Integer} dcid Location in which to create the server. See v1/regions/list.
	 * @param {Integer} metalplanid Plan to use when creating this server. See v1/plans/list_baremetal.
	 * @param {Integer} osid Operating system to use. See v1/os/list.
	 * @param {Integer} scriptid (optional) The SCRIPTID of a startup script to execute on boot. This only works when using a Vultr supplied operating system. See v1/startupscript/list.
	 * @param {String} snapshotid (optional) If you've selected the 'snapshot' operating system, this should be the SNAPSHOTID (see v1/snapshot/list) to restore for the initial installation.
	 * @param {String} enable_ipv6 (optional) 'yes' or 'no'.  If yes, an IPv6 subnet will be assigned to the server.
	 * @param {String} label (optional) This is a text label that will be shown in the control panel.
	 * @param {String} sshkeyid (optional) List of SSH keys to apply to this server on install (only valid for Linux/FreeBSD). See v1/sshkey/list. Separate keys with commas.
	 * @param {Integer} appid (optional) If launching an application (OSID 186), this is the APPID to launch. See v1/app/list.
	 * @param {String} userdata (optional) Base64 encoded user-data.
	 * @param {String} notify_activate (optional, default 'yes') 'yes' or 'no'. If yes, an activation email will be sent when the server is ready.
	 * @param {String} hostname (optional) The hostname to assign to this server.
	 * @param {String} tag (optional) The tag to assign to this server.
	 * @return {Promise}
	 */
	create (dcid, metalplanid, osid, scriptid, snapshotid, enable_ipv6, label, sshkeyid, appid, userdata, notify_activate, hostname, tag) {
		let payload = {'DCID' : dcid, 'METALPLANID' : metalplanid, 'OSID' : osid, 'notify_activate' : notify_activate };
		if(scriptid !== undefined) { payload['SCRIPTID'] = scriptid; }
		if(snapshotid !== undefined) { payload['SNAPSHOTID'] = snapshotid; }
		if(enable_ipv6 !== undefined) { payload['enable_ipv6'] = enable_ipv6; }
		if(label !== undefined) { payload['label'] = label; }
		if(sshkeyid !== undefined) { payload['SSHKEYID'] = sshkeyid; }
		if(appid !== undefined) { payload['APPID'] = appid; }
		if(userdata !== undefined) { payload['userdata'] = userdata; }
		if(hostname !== undefined) { payload['hostname'] = hostname; }
		if(tag !== undefined) { payload['tag'] = tag; }
		return this.rest.execute('/v1/baremetal/create', true, 'POST', payload);
	}
	/**
	 * Destroy (delete) a baremetal server. All data will be permanently lost, and the IP address will be released. There is no going back from this call.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/baremetal/list call.
	 * @return {Promise}
	 */
	destroy (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/baremetal/destroy', true, 'POST', payload);
	}
	/**
	 * Retrieves the application information for a baremetal server.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/baremetal/list call.
	 * @return {Promise}
	 */
	get_app_info (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/baremetal/get_app_info', true, 'GET', payload);
	}
	/**
	 * Retrieves the (base64 encoded) user-data for this subscription.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/baremetal/list call.
	 * @return {Promise}
	 */
	get_user_data (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/baremetal/get_user_data', true, 'GET', payload);
	}
	/**
	 * Halt a baremetal server. This is a hard power off, meaning that the power to the machine is severed. The data on the machine will not be modified, and you will still be billed for the machine. To completely delete a machine, see v1/baremetal/destroy.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/baremetal/list call.
	 * @return {Promise}
	 */
	halt (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/baremetal/halt', true, 'POST', payload);
	}
	/**
	 * Enables IPv6 networking on a baremetal server by assigning an IPv6 subnet to it. The server will not be rebooted when the subnet is assigned. It is possible to check whether or not IPv6 networking has been enabled with v1/baremetal/list_ipv6.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/baremetal/list call.
	 * @return {Promise}
	 */
	ipv6_enable (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/baremetal/ipv6_enable', true, 'POST', payload);
	}
	/**
	 * Set the label of a baremetal server.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/baremetal/list call.
	 * @param {String} label This is a text label that will be shown in the control panel.
	 * @return {Promise}
	 */
	label_set (subid, label) {
		let payload = {'SUBID' : subid, 'label' : label };
		return this.rest.execute('/v1/baremetal/label_set', true, 'POST', payload);
	}
	/**
	 * List all baremetal servers on the current account. This includes both pending and active servers.
	 *
	 * @param {Integer} subid (optional) Unique identifier of a subscription. Only the subscription object will be returned.
	 * @param {String} tag (optional) A tag string. Only subscription objects with this tag will be returned.
	 * @param {String} label (optional) A text label string. Only subscription objects with this text label will be returned.
	 * @param {String} main_ip (optional) An IPv4 address. Only the subscription matching this IPv4 address will be returned.
	 * @return {Promise}
	 */
	list (subid, tag, label, main_ip) {
		let payload = { };
		if(subid !== undefined) { payload['SUBID'] = subid; }
		if(tag !== undefined) { payload['tag'] = tag; }
		if(label !== undefined) { payload['label'] = label; }
		if(main_ip !== undefined) { payload['main_ip'] = main_ip; }
		return this.rest.execute('/v1/baremetal/list', true, 'GET', payload);
	}
	/**
	 * List the IPv4 information of a baremetal server. IP information is only available for baremetal servers in the &quot;active&quot; state.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/baremetal/list call.
	 * @return {Promise}
	 */
	list_ipv4 (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/baremetal/list_ipv4', true, 'GET', payload);
	}
	/**
	 * List the IPv6 information of a baremetal server. IP information is only available for baremetal servers in the &quot;active&quot; state. If the baremetal server does not have IPv6 enabled, then an empty array is returned.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/baremetal/list call.
	 * @return {Promise}
	 */
	list_ipv6 (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/baremetal/list_ipv6', true, 'GET', payload);
	}
	/**
	 * Changes the baremetal server to a different operating system. All data will be permanently lost.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/baremetal/list call.
	 * @param {Integer} osid Operating system to use. See /v1/baremetal/os_change_list.
	 * @return {Promise}
	 */
	os_change (subid, osid) {
		let payload = {'SUBID' : subid, 'OSID' : osid };
		return this.rest.execute('/v1/baremetal/os_change', true, 'POST', payload);
	}
	/**
	 * Retrieves a list of operating systems to which a baremetal server can be changed. Always check against this list before trying to switch operating systems because it is not possible to switch between every operating system combination.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/baremetal/list call.
	 * @return {Promise}
	 */
	os_change_list (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/baremetal/os_change_list', true, 'GET', payload);
	}
	/**
	 * Reboot a baremetal server. This is a hard reboot, which means that the server is powered off, then back on.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/baremetal/list call.
	 * @return {Promise}
	 */
	reboot (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/baremetal/reboot', true, 'POST', payload);
	}
	/**
	 * Reinstall the operating system on a baremetal server. All data will be permanently lost, but the IP address will remain the same. There is no going back from this call.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/baremetal/list call.
	 * @return {Promise}
	 */
	reinstall (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/baremetal/reinstall', true, 'POST', payload);
	}
	/**
	 * Sets the user-data for this subscription. User-data is a generic data store, which some provisioning tools and cloud operating systems use as a configuration file. It is generally consumed only once after an instance has been launched, but individual needs may vary.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/baremetal/list call.
	 * @param {String} userdata Base64 encoded user-data
	 * @return {Promise}
	 */
	set_user_data (subid, userdata) {
		let payload = {'SUBID' : subid, 'userdata' : userdata };
		return this.rest.execute('/v1/baremetal/set_user_data', true, 'POST', payload);
	}
	/**
	 * Set the tag of a baremetal server.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/baremetal/list call.
	 * @param {String} tag The tag to assign to this server. This tag is shown in the control panel.
	 * @return {Promise}
	 */
	tag_set (subid, tag) {
		let payload = {'SUBID' : subid, 'tag' : tag };
		return this.rest.execute('/v1/baremetal/tag_set', true, 'POST', payload);
	}
}
class BlockStorage {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Attach a block storage subscription to a VPS subscription.  The block storage volume must not be attached to any other VPS subscriptions for this to work.
	 *
	 * @param {Integer} subid ID of the block storage subscription to attach
	 * @param {Integer} attach_to_subid ID of the VPS subscription to mount the block storage subscription to
	 * @return {Promise}
	 */
	attach (subid, attach_to_subid) {
		let payload = {'SUBID' : subid, 'attach_to_SUBID' : attach_to_subid };
		return this.rest.execute('/v1/block/attach', true, 'POST', payload);
	}
	/**
	 * Create a block storage subscription.
	 *
	 * @param {Integer} dcid DCID of the location to create this subscription in.  See /v1/regions/list
	 * @param {Integer} size_gb Size (in GB) of this subscription.
	 * @param {String} label (optional) Text label that will be associated with the subscription
	 * @return {Promise}
	 */
	create (dcid, size_gb, label) {
		let payload = {'DCID' : dcid, 'size_gb' : size_gb };
		if(label !== undefined) { payload['label'] = label; }
		return this.rest.execute('/v1/block/create', true, 'POST', payload);
	}
	/**
	 * Delete a block storage subscription.  All data will be permanently lost. There is no going back from this call.
	 *
	 * @param {Integer} subid ID of the block storage subscription to delete
	 * @return {Promise}
	 */
	delete (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/block/delete', true, 'POST', payload);
	}
	/**
	 * Detach a block storage subscription from the currently attached instance.
	 *
	 * @param {Integer} subid ID of the block storage subscription to detach
	 * @return {Promise}
	 */
	detach (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/block/detach', true, 'POST', payload);
	}
	/**
	 * Set the label of a block storage subscription.
	 *
	 * @param {Integer} subid ID of the block storage subscription.
	 * @param {String} label Text label that will be shown in the control panel.
	 * @return {Promise}
	 */
	label_set (subid, label) {
		let payload = {'SUBID' : subid, 'label' : label };
		return this.rest.execute('/v1/block/label_set', true, 'POST', payload);
	}
	/**
	 * Retrieve a list of any active block storage subscriptions on this account.
	 *
	 * @param {Integer} subid (optional) Unique identifier of a subscription. Only the subscription object will be returned.
	 * @return {Promise}
	 */
	list (subid) {
		let payload = { };
		if(subid !== undefined) { payload['SUBID'] = subid; }
		return this.rest.execute('/v1/block/list', true, 'GET', payload);
	}
	/**
	 * Resize the block storage volume to a new size.
	 *
	 * @param {Integer} subid ID of the block storage subscription to resize
	 * @param {Integer} size_gb New size (in GB) of the block storage subscription
	 * @return {Promise}
	 */
	resize (subid, size_gb) {
		let payload = {'SUBID' : subid, 'size_gb' : size_gb };
		return this.rest.execute('/v1/block/resize', true, 'POST', payload);
	}
}
class DNS {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Create a domain name in DNS.
	 *
	 * @param {String} domain Domain name to create
	 * @param {String} serverip Server IP to use when creating default records (A and MX)
	 * @return {Promise}
	 */
	create_domain (domain, serverip) {
		let payload = {'domain' : domain, 'serverip' : serverip };
		return this.rest.execute('/v1/dns/create_domain', true, 'POST', payload);
	}
	/**
	 * Add a DNS record.
	 *
	 * @param {String} domain Domain name to add record to
	 * @param {String} name Name (subdomain) of record
	 * @param {String} type Type (A, AAAA, MX, etc) of record
	 * @param {String} data Data for this record
	 * @param {Integer} ttl (optional) TTL of this record
	 * @param {Integer} priority (only required for MX and SRV) Priority of this record (omit the priority from the data)
	 * @return {Promise}
	 */
	create_record (domain, name, type, data, ttl, priority) {
		let payload = {'domain' : domain, 'name' : name, 'type' : type, 'data' : data, 'priority' : priority };
		if(ttl !== undefined) { payload['ttl'] = ttl; }
		return this.rest.execute('/v1/dns/create_record', true, 'POST', payload);
	}
	/**
	 * Delete a domain name and all associated records.
	 *
	 * @param {String} domain Domain name to delete
	 * @return {Promise}
	 */
	delete_domain (domain) {
		let payload = {'domain' : domain };
		return this.rest.execute('/v1/dns/delete_domain', true, 'POST', payload);
	}
	/**
	 * Delete an individual DNS record.
	 *
	 * @param {String} domain Domain name to delete record from
	 * @param {Integer} recordid ID of record to delete (see /dns/records)
	 * @return {Promise}
	 */
	delete_record (domain, recordid) {
		let payload = {'domain' : domain, 'RECORDID' : recordid };
		return this.rest.execute('/v1/dns/delete_record', true, 'POST', payload);
	}
	/**
	 * Enable or disable DNSSEC for a domain.
	 *
	 * @param {String} domain Domain name to update record
	 * @param {String} enable 'yes' or 'no'.  If yes, DNSSEC will be enabled for the given domain
	 * @return {Promise}
	 */
	dnssec_enable (domain, enable) {
		let payload = {'domain' : domain, 'enable' : enable };
		return this.rest.execute('/v1/dns/dnssec_enable', true, 'POST', payload);
	}
	/**
	 * Get the DNSSEC keys (if enabled) for a domain.
	 *
	 * @param {String} domain Domain from which to gather DNSSEC keys.
	 * @return {Promise}
	 */
	dnssec_info (domain) {
		let payload = {'domain' : domain };
		return this.rest.execute('/v1/dns/dnssec_info', true, 'GET', payload);
	}
	/**
	 * List all domains associated with the current account.
	 *
	 * @return {Promise}
	 */
	list () {
		return this.rest.execute('/v1/dns/list', true, 'GET');
	}
	/**
	 * List all the records associated with a particular domain.
	 *
	 * @param {String} domain Domain to list records for
	 * @return {Promise}
	 */
	records (domain) {
		let payload = {'domain' : domain };
		return this.rest.execute('/v1/dns/records', true, 'GET', payload);
	}
	/**
	 * Get the SOA record information for a domain.
	 *
	 * @param {String} domain Domain from which to gather SOA information
	 * @return {Promise}
	 */
	soa_info (domain) {
		let payload = {'domain' : domain };
		return this.rest.execute('/v1/dns/soa_info', true, 'GET', payload);
	}
	/**
	 * Update the SOA record information for a domain.
	 *
	 * @param {String} domain Domain name to update record
	 * @param {String} nsprimary (Optional) Primary nameserver to store in the SOA record
	 * @param {String} email (Optional) Administrative email to store in the SOA record
	 * @return {Promise}
	 */
	soa_update (domain, nsprimary, email) {
		let payload = {'domain' : domain, 'nsprimary' : nsprimary, 'email' : email };
		return this.rest.execute('/v1/dns/soa_update', true, 'POST', payload);
	}
	/**
	 * Update a DNS record.
	 *
	 * @param {String} domain Domain name to update record
	 * @param {Integer} recordid ID of record to update (see /dns/records)
	 * @param {String} name (optional) Name (subdomain) of record
	 * @param {String} data (optional) Data for this record
	 * @param {Integer} ttl (optional) TTL of this record
	 * @param {Integer} priority (optional) (only required for MX and SRV) Priority of this record (omit the priority from the data)
	 * @return {Promise}
	 */
	update_record (domain, recordid, name, data, ttl, priority) {
		let payload = {'domain' : domain, 'RECORDID' : recordid };
		if(name !== undefined) { payload['name'] = name; }
		if(data !== undefined) { payload['data'] = data; }
		if(ttl !== undefined) { payload['ttl'] = ttl; }
		if(priority !== undefined) { payload['priority'] = priority; }
		return this.rest.execute('/v1/dns/update_record', true, 'POST', payload);
	}
}
class Firewall {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Create a new firewall group on the current account.
	 *
	 * @param {String} description (optional) Description of firewall group.
	 * @return {Promise}
	 */
	group_create (description) {
		let payload = { };
		if(description !== undefined) { payload['description'] = description; }
		return this.rest.execute('/v1/firewall/group_create', true, 'POST', payload);
	}
	/**
	 * Delete a firewall group. Use this function with caution because the firewall group being deleted will be detached from all servers. This can result in open ports accessible to the internet.
	 *
	 * @param {String} firewallgroupid Firewall group to delete.
	 * @return {Promise}
	 */
	group_delete (firewallgroupid) {
		let payload = {'FIREWALLGROUPID' : firewallgroupid };
		return this.rest.execute('/v1/firewall/group_delete', true, 'POST', payload);
	}
	/**
	 * List all firewall groups on the current account.
	 *
	 * @param {String} firewallgroupid (optional) Filter result set to only contain this firewall group.
	 * @return {Promise}
	 */
	group_list (firewallgroupid) {
		let payload = { };
		if(firewallgroupid !== undefined) { payload['FIREWALLGROUPID'] = firewallgroupid; }
		return this.rest.execute('/v1/firewall/group_list', true, 'GET', payload);
	}
	/**
	 * Change the description on a firewall group.
	 *
	 * @param {String} firewallgroupid Firewall group to update.
	 * @param {String} description Description of firewall group.
	 * @return {Promise}
	 */
	group_set_description (firewallgroupid, description) {
		let payload = {'FIREWALLGROUPID' : firewallgroupid, 'description' : description };
		return this.rest.execute('/v1/firewall/group_set_description', true, 'POST', payload);
	}
	/**
	 * Create a rule in a firewall group.
	 *
	 * @param {String} firewallgroupid Target firewall group. See /v1/firewall/group_list.
	 * @param {String} direction Direction of rule. Possible values: &quot;in&quot;.
	 * @param {String} ip_type IP address type. Possible values: &quot;v4&quot;, &quot;v6&quot;.
	 * @param {String} protocol Protocol type. Possible values: &quot;icmp&quot;, &quot;tcp&quot;, &quot;udp&quot;, &quot;gre&quot;.
	 * @param {String} subnet IP address representing a subnet. The IP address format must match with the &quot;ip_type&quot; parameter value.
	 * @param {Integer} subnet_size IP prefix size in bits.
	 * @param {String} port (optional) TCP/UDP only. This field can be an integer value specifying a port or a colon separated port range.
	 * @return {Promise}
	 */
	rule_create (firewallgroupid, direction, ip_type, protocol, subnet, subnet_size, port) {
		let payload = {'FIREWALLGROUPID' : firewallgroupid, 'direction' : direction, 'ip_type' : ip_type, 'protocol' : protocol, 'subnet' : subnet, 'subnet_size' : subnet_size };
		if(port !== undefined) { payload['port'] = port; }
		return this.rest.execute('/v1/firewall/rule_create', true, 'POST', payload);
	}
	/**
	 * Delete a rule in a firewall group.
	 *
	 * @param {String} firewallgroupid Target firewall group. See /v1/firewall/group_list.
	 * @param {Integer} rulenumber Rule number to delete. See /v1/firewall/rule_list.
	 * @return {Promise}
	 */
	rule_delete (firewallgroupid, rulenumber) {
		let payload = {'FIREWALLGROUPID' : firewallgroupid, 'rulenumber' : rulenumber };
		return this.rest.execute('/v1/firewall/rule_delete', true, 'POST', payload);
	}
	/**
	 * List the rules in a firewall group.
	 *
	 * @param {String} firewallgroupid Target firewall group. See /v1/firewall/group_list.
	 * @param {String} direction Direction of firewall rules. Possible values: &quot;in&quot;.
	 * @param {String} ip_type IP address type. Possible values: &quot;v4&quot;, &quot;v6&quot;.
	 * @return {Promise}
	 */
	rule_list (firewallgroupid, direction, ip_type) {
		let payload = {'FIREWALLGROUPID' : firewallgroupid, 'direction' : direction, 'ip_type' : ip_type };
		return this.rest.execute('/v1/firewall/rule_list', true, 'GET', payload);
	}
}
class ISOImage {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Create a new ISO image on the current account. The ISO image will be downloaded from a given URL. Download status can be checked with the v1/iso/list call.
	 *
	 * @param {String} url Remote URL from where the ISO will be downloaded.
	 * @return {Promise}
	 */
	create_from_url (url) {
		let payload = {'url' : url };
		return this.rest.execute('/v1/iso/create_from_url', true, 'POST', payload);
	}
	/**
	 * List all ISOs currently available on this account.
	 *
	 * @return {Promise}
	 */
	list () {
		return this.rest.execute('/v1/iso/list', true, 'GET');
	}
}
class OperatingSystem {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Retrieve a list of available operating systems.  If the &quot;windows&quot; flag is true, a Windows license will be included with the instance, which will increase the cost.
	 *
	 * @return {Promise}
	 */
	list () {
		return this.rest.execute('/v1/os/list', false, 'GET');
	}
}
class Plans {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Retrieve a list of all active plans. Plans that are no longer available will not be shown.
	 *
	 * @param {String} type (optional) The type of plans to return. Possible values: &quot;all&quot;, &quot;vc2&quot;, &quot;ssd&quot;, &quot;vdc2&quot;, &quot;dedicated&quot;.
	 * @return {Promise}
	 */
	plan_list (type) {
		let payload = { };
		if(type !== undefined) { payload['type'] = type; }
		return this.rest.execute('/v1/plans/list', true, 'GET', payload);
	}
	/**
	 * Retrieve a list of all active baremetal plans. Plans that are no longer available will not be shown.
	 *
	 * @return {Promise}
	 */
	plan_list_baremetal () {
		return this.rest.execute('/v1/plans/list_baremetal', true, 'GET');
	}
	/**
	 * Retrieve a list of all active vc2 plans. Plans that are no longer available will not be shown.
	 *
	 * @return {Promise}
	 */
	plan_list_vc2 () {
		return this.rest.execute('/v1/plans/list_vc2', true, 'GET');
	}
	/**
	 * Retrieve a list of all active vdc2 plans. Plans that are no longer available will not be shown.
	 *
	 * @return {Promise}
	 */
	plan_list_vdc2 () {
		return this.rest.execute('/v1/plans/list_vdc2', true, 'GET');
	}
}
class Regions {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Retrieve a list of the VPSPLANIDs currently available in this location.
	 *
	 * @param {Integer} dcid Location to check availability.
	 * @param {String} type (optional) The type of plans for which to include availability. Possible values: &quot;all&quot;, &quot;vc2&quot;, &quot;ssd&quot;, &quot;vdc2&quot;, &quot;dedicated&quot;.
	 * @return {Promise}
	 */
	region_availability (dcid, type) {
		let payload = {'DCID' : dcid };
		if(type !== undefined) { payload['type'] = type; }
		return this.rest.execute('/v1/regions/availability', false, 'GET', payload);
	}
	/**
	 * Retrieve a list of the METALPLANIDs currently available in this location.
	 *
	 * @param {Integer} dcid Location to check availability.
	 * @return {Promise}
	 */
	region_availability_baremetal (dcid) {
		let payload = {'DCID' : dcid };
		return this.rest.execute('/v1/regions/availability_baremetal', true, 'GET', payload);
	}
	/**
	 * Retrieve a list of the vc2 VPSPLANIDs currently available in this location.
	 *
	 * @param {Integer} dcid Location to check availability.
	 * @return {Promise}
	 */
	region_availability_vc2 (dcid) {
		let payload = {'DCID' : dcid };
		return this.rest.execute('/v1/regions/availability_vc2', false, 'GET', payload);
	}
	/**
	 * Retrieve a list of the vdc2 VPSPLANIDs currently available in this location.
	 *
	 * @param {Integer} dcid Location to check availability.
	 * @return {Promise}
	 */
	region_availability_vdc2 (dcid) {
		let payload = {'DCID' : dcid };
		return this.rest.execute('/v1/regions/availability_vdc2', false, 'GET', payload);
	}
	/**
	 * Retrieve a list of all active regions. Note that just because a region is listed here, does not mean that there is room for new servers.
	 *
	 * @param {String} availability (optional) 'yes' or 'no'. If 'yes', include the current availability with each region entry.
	 * @return {Promise}
	 */
	region_list (availability) {
		let payload = { };
		if(availability !== undefined) { payload['availability'] = availability; }
		return this.rest.execute('/v1/regions/list', false, 'GET', payload);
	}
}
class ReservedIP {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Attach a reserved IP to an existing subscription.
	 *
	 * @param {String} ip_address Reserved IP to be attached. Include the subnet size in this parameter (e.g: /32 or /64).
	 * @param {Integer} attach_subid Unique identifier of the target server.
	 * @return {Promise}
	 */
	attach (ip_address, attach_subid) {
		let payload = {'ip_address' : ip_address, 'attach_SUBID' : attach_subid };
		return this.rest.execute('/v1/reservedip/attach', true, 'POST', payload);
	}
	/**
	 * Convert an existing IP on a subscription to a reserved IP. Returns the SUBID of the newly created reserved IP.
	 *
	 * @param {Integer} subid SUBID of the server that currently has the IP address you want to convert
	 * @param {String} ip_address IP address you want to convert (v4 must be a /32, v6 must be a /64)
	 * @param {String} label (optional) Label for this reserved IP
	 * @return {Promise}
	 */
	convert (subid, ip_address, label) {
		let payload = {'SUBID' : subid, 'ip_address' : ip_address };
		if(label !== undefined) { payload['label'] = label; }
		return this.rest.execute('/v1/reservedip/convert', true, 'POST', payload);
	}
	/**
	 * Create a new reserved IP. Reserved IPs can only be used within the same datacenter for which they were created.
	 *
	 * @param {Integer} dcid Location to create this reserved IP in.  See v1/regions/list
	 * @param {String} ip_type 'v4' or 'v6' Type of reserved IP to create
	 * @param {String} label (optional) Label for this reserved IP
	 * @return {Promise}
	 */
	create (dcid, ip_type, label) {
		let payload = {'DCID' : dcid, 'ip_type' : ip_type };
		if(label !== undefined) { payload['label'] = label; }
		return this.rest.execute('/v1/reservedip/create', true, 'POST', payload);
	}
	/**
	 * Remove a reserved IP from your account. After making this call, you will not be able to recover the IP address.
	 *
	 * @param {String} ip_address Reserved IP to remove from your account.
	 * @return {Promise}
	 */
	destroy (ip_address) {
		let payload = {'ip_address' : ip_address };
		return this.rest.execute('/v1/reservedip/destroy', true, 'POST', payload);
	}
	/**
	 * Detach a reserved IP from an existing subscription.
	 *
	 * @param {String} ip_address Reserved IP to be detached. Include the subnet size in this parameter (e.g: /32 or /64).
	 * @param {Integer} detach_subid Unique identifier of the target server.
	 * @return {Promise}
	 */
	detach (ip_address, detach_subid) {
		let payload = {'ip_address' : ip_address, 'detach_SUBID' : detach_subid };
		return this.rest.execute('/v1/reservedip/detach', true, 'POST', payload);
	}
	/**
	 * List all the active reserved IPs on this account. The &quot;subnet_size&quot; field is the size of the network assigned to this subscription. This will typically be a /64 for IPv6, or a /32 for IPv4.
	 *
	 * @return {Promise}
	 */
	ip_list () {
		return this.rest.execute('/v1/reservedip/list', true, 'GET');
	}
}
class Server {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Changes the virtual machine to a different application. All data will be permanently lost.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @param {Integer} appid Application to use. See /v1/server/app_change_list.
	 * @return {Promise}
	 */
	app_change (subid, appid) {
		let payload = {'SUBID' : subid, 'APPID' : appid };
		return this.rest.execute('/v1/server/app_change', true, 'POST', payload);
	}
	/**
	 * Retrieves a list of applications to which a virtual machine can be changed. Always check against this list before trying to switch applications because it is not possible to switch between every application combination.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	app_change_list (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/app_change_list', true, 'GET', payload);
	}
	/**
	 * Disables automatic backups on a server. Once disabled, backups can only be enabled again by customer support.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	backup_disable (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/backup_disable', true, 'POST', payload);
	}
	/**
	 * Enables automatic backups on a server.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	backup_enable (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/backup_enable', true, 'POST', payload);
	}
	/**
	 * Retrieves the backup schedule for a server. All time values are in UTC.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	backup_get_schedule (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/backup_get_schedule', true, 'POST', payload);
	}
	/**
	 * Sets the backup schedule for a server. All time values are in UTC.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @param {String} cron_type Backup cron type. Can be one of 'daily', 'weekly', 'monthly', 'daily_alt_even', or 'daily_alt_odd'.
	 * @param {Integer} hour (optional) Hour value (0-23). Applicable to crons: 'daily', 'weekly', 'monthly', 'daily_alt_even', 'daily_alt_odd'
	 * @param {Integer} dow (optional) Day-of-week value (0-6). Applicable to crons: 'weekly'.
	 * @param {Integer} dom (optional) Day-of-month value (1-28). Applicable to crons: 'monthly'.
	 * @return {Promise}
	 */
	backup_set_schedule (subid, cron_type, hour, dow, dom) {
		let payload = {'SUBID' : subid, 'cron_type' : cron_type };
		if(hour !== undefined) { payload['hour'] = hour; }
		if(dow !== undefined) { payload['dow'] = dow; }
		if(dom !== undefined) { payload['dom'] = dom; }
		return this.rest.execute('/v1/server/backup_set_schedule', true, 'POST', payload);
	}
	/**
	 * Get the bandwidth used by a virtual machine.
	 *
	 * @param {Integer} subid Unique identifier for this subscription.  These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	bandwidth (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/bandwidth', true, 'GET', payload);
	}
	/**
	 * Create a new virtual machine. You will start being billed for this immediately. The response only contains the SUBID for the new machine.
	 *
	 * @param {Integer} dcid Location to create this virtual machine in.  See v1/regions/list
	 * @param {Integer} vpsplanid Plan to use when creating this virtual machine.  See v1/plans/list
	 * @param {Integer} osid Operating system to use.  See v1/os/list
	 * @param {String} ipxe_chain_url (optional) If you've selected the 'custom' operating system, this can be set to chainload the specified URL on bootup, via iPXE
	 * @param {String} isoid (optional)  If you've selected the 'custom' operating system, this is the ID of a specific ISO to mount during the deployment
	 * @param {Integer} scriptid (optional) If you've not selected a 'custom' operating system, this can be the SCRIPTID of a startup script to execute on boot.  See v1/startupscript/list
	 * @param {String} snapshotid (optional) If you've selected the 'snapshot' operating system, this should be the SNAPSHOTID (see v1/snapshot/list) to restore for the initial installation.
	 * @param {String} enable_ipv6 (optional) 'yes' or 'no'.  If yes, an IPv6 subnet will be assigned to the machine (where available)
	 * @param {String} enable_private_network (optional) 'yes' or 'no'. If yes, private networking support will be added to the new server.
	 * @param {Array} networkid (optional) List of private networks to attach to this server.  Use either this field or enable_private_network, not both
	 * @param {String} label (optional) This is a text label that will be shown in the control panel
	 * @param {String} sshkeyid (optional) List of SSH keys to apply to this server on install (only valid for Linux/FreeBSD).  See v1/sshkey/list.  Separate keys with commas
	 * @param {String} auto_backups (optional) 'yes' or 'no'.  If yes, automatic backups will be enabled for this server (these have an extra charge associated with them)
	 * @param {Integer} appid (optional) If launching an application (OSID 186), this is the APPID to launch. See v1/app/list.
	 * @param {String} userdata (optional) Base64 encoded user-data
	 * @param {String} notify_activate (optional, default 'yes') 'yes' or 'no'. If yes, an activation email will be sent when the server is ready.
	 * @param {(optional,} ddos_protection default 'no') 'yes' or 'no'.  If yes, DDOS protection will be enabled on the subscription (there is an additional charge for this)
	 * @param {String} reserved_ip_v4 (optional) IP address of the floating IP to use as the main IP of this server
	 * @param {String} hostname (optional) The hostname to assign to this server.
	 * @param {String} tag (optional) The tag to assign to this server.
	 * @param {String} firewallgroupid (optional) The firewall group to assign to this server. See /v1/firewall/group_list.
	 * @return {Promise}
	 */
	create (dcid, vpsplanid, osid, ipxe_chain_url, isoid, scriptid, snapshotid, enable_ipv6, enable_private_network, networkid, label, sshkeyid, auto_backups, appid, userdata, notify_activate, ddos_protection, reserved_ip_v4, hostname, tag, firewallgroupid) {
		let payload = {'DCID' : dcid, 'VPSPLANID' : vpsplanid, 'OSID' : osid, 'notify_activate' : notify_activate, 'ddos_protection' : ddos_protection };
		if(ipxe_chain_url !== undefined) { payload['ipxe_chain_url'] = ipxe_chain_url; }
		if(isoid !== undefined) { payload['ISOID'] = isoid; }
		if(scriptid !== undefined) { payload['SCRIPTID'] = scriptid; }
		if(snapshotid !== undefined) { payload['SNAPSHOTID'] = snapshotid; }
		if(enable_ipv6 !== undefined) { payload['enable_ipv6'] = enable_ipv6; }
		if(enable_private_network !== undefined) { payload['enable_private_network'] = enable_private_network; }
		if(networkid !== undefined) { payload['NETWORKID'] = networkid; }
		if(label !== undefined) { payload['label'] = label; }
		if(sshkeyid !== undefined) { payload['SSHKEYID'] = sshkeyid; }
		if(auto_backups !== undefined) { payload['auto_backups'] = auto_backups; }
		if(appid !== undefined) { payload['APPID'] = appid; }
		if(userdata !== undefined) { payload['userdata'] = userdata; }
		if(reserved_ip_v4 !== undefined) { payload['reserved_ip_v4'] = reserved_ip_v4; }
		if(hostname !== undefined) { payload['hostname'] = hostname; }
		if(tag !== undefined) { payload['tag'] = tag; }
		if(firewallgroupid !== undefined) { payload['FIREWALLGROUPID'] = firewallgroupid; }
		return this.rest.execute('/v1/server/create', true, 'POST', payload);
	}
	/**
	 * Add a new IPv4 address to a server. You will start being billed for this immediately. The server will be rebooted unless you specify otherwise. You must reboot the server before the IPv4 address can be configured.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @param {String} reboot (optional, default 'yes') 'yes' or 'no'. If yes, the server is rebooted immediately.
	 * @return {Promise}
	 */
	create_ipv4 (subid, reboot) {
		let payload = {'SUBID' : subid, 'reboot' : reboot };
		return this.rest.execute('/v1/server/create_ipv4', true, 'POST', payload);
	}
	/**
	 * Destroy (delete) a virtual machine. All data will be permanently lost, and the IP address will be released. There is no going back from this call.
	 *
	 * @param {Integer} subid Unique identifier for this subscription.  These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	destroy (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/destroy', true, 'POST', payload);
	}
	/**
	 * Removes a secondary IPv4 address from a server. Your server will be hard-restarted. We suggest halting the machine gracefully before removing IPs.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @param {String} ip IPv4 address to remove.
	 * @return {Promise}
	 */
	destroy_ipv4 (subid, ip) {
		let payload = {'SUBID' : subid, 'ip' : ip };
		return this.rest.execute('/v1/server/destroy_ipv4', true, 'POST', payload);
	}
	/**
	 * Set, change, or remove the firewall group currently applied to a server.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. See v1/server/list.
	 * @param {String} firewallgroupid The firewall group to apply to this server. A value of &quot;0&quot; means &quot;no firewall group&quot;. See /v1/firewall/group_list.
	 * @return {Promise}
	 */
	firewall_group_set (subid, firewallgroupid) {
		let payload = {'SUBID' : subid, 'FIREWALLGROUPID' : firewallgroupid };
		return this.rest.execute('/v1/server/firewall_group_set', true, 'POST', payload);
	}
	/**
	 * Retrieves the application information for this subscription.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	get_app_info (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/get_app_info', true, 'GET', payload);
	}
	/**
	 * Retrieves the (base64 encoded) user-data for this subscription.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	get_user_data (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/get_user_data', true, 'GET', payload);
	}
	/**
	 * Halt a virtual machine. This is a hard power off (basically, unplugging the machine). The data on the machine will not be modified, and you will still be billed for the machine. To completely delete a machine, see v1/server/destroy.
	 *
	 * @param {Integer} subid Unique identifier for this subscription.  These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	halt (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/halt', true, 'POST', payload);
	}
	/**
	 * Enables IPv6 networking on a server by assigning an IPv6 subnet to it. The server will be automatically rebooted to complete the request. No action occurs if IPv6 networking was already enabled. It is possible to check whether or not IPv6 networking has been enabled with v1/server/list_ipv6.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	ipv6_enable (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/ipv6_enable', true, 'POST', payload);
	}
	/**
	 * Attach an ISO and reboot the server.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the /v1/server/list call.
	 * @param {Integer} isoid The ISO that will be mounted. See the /v1/iso/list call.
	 * @return {Promise}
	 */
	iso_attach (subid, isoid) {
		let payload = {'SUBID' : subid, 'ISOID' : isoid };
		return this.rest.execute('/v1/server/iso_attach', true, 'POST', payload);
	}
	/**
	 * Detach the currently mounted ISO and reboot the server.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the /v1/server/list call.
	 * @return {Promise}
	 */
	iso_detach (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/iso_detach', true, 'POST', payload);
	}
	/**
	 * Retrieve the current ISO state for a given subscription. The returned state may be one of: ready | isomounting | isomounted. ISOID will only be set when the mounted ISO exists in your library ( see /v1/iso/list ). Otherwise, it will read &quot;0&quot;.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the /v1/server/list call.
	 * @return {Promise}
	 */
	iso_status (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/iso_status', true, 'GET', payload);
	}
	/**
	 * Set the label of a virtual machine.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @param {String} label This is a text label that will be shown in the control panel.
	 * @return {Promise}
	 */
	label_set (subid, label) {
		let payload = {'SUBID' : subid, 'label' : label };
		return this.rest.execute('/v1/server/label_set', true, 'POST', payload);
	}
	/**
	 * List all active or pending virtual machines on the current account.
	 *
	 * @param {Integer} subid (optional) Unique identifier of a subscription. Only the subscription object will be returned.
	 * @param {String} tag (optional) A tag string. Only subscription objects with this tag will be returned.
	 * @param {String} label (optional) A text label string. Only subscription objects with this text label will be returned.
	 * @param {String} main_ip (optional) An IPv4 address. Only the subscription matching this IPv4 address will be returned.
	 * @return {Promise}
	 */
	list (subid, tag, label, main_ip) {
		let payload = { };
		if(subid !== undefined) { payload['SUBID'] = subid; }
		if(tag !== undefined) { payload['tag'] = tag; }
		if(label !== undefined) { payload['label'] = label; }
		if(main_ip !== undefined) { payload['main_ip'] = main_ip; }
		return this.rest.execute('/v1/server/list', true, 'GET', payload);
	}
	/**
	 * List the IPv4 information of a virtual machine. IP information is only available for virtual machines in the &quot;active&quot; state.
	 *
	 * @return {Promise}
	 */
	list_ipv4 () {
		return this.rest.execute('/v1/server/list_ipv4', true, 'GET');
	}
	/**
	 * List the IPv6 information of a virtual machine. IP information is only available for virtual machines in the &quot;active&quot; state. If the virtual machine does not have IPv6 enabled, then an empty array is returned.
	 *
	 * @return {Promise}
	 */
	list_ipv6 () {
		return this.rest.execute('/v1/server/list_ipv6', true, 'GET');
	}
	/**
	 * Determine what other subscriptions are hosted on the same physical host as a given subscription.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	neighbors (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/neighbors', true, 'GET', payload);
	}
	/**
	 * Changes the virtual machine to a different operating system. All data will be permanently lost.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @param {Integer} osid Operating system to use. See /v1/server/os_change_list.
	 * @return {Promise}
	 */
	os_change (subid, osid) {
		let payload = {'SUBID' : subid, 'OSID' : osid };
		return this.rest.execute('/v1/server/os_change', true, 'POST', payload);
	}
	/**
	 * Retrieves a list of operating systems to which a virtual machine can be changed. Always check against this list before trying to switch operating systems because it is not possible to switch between every operating system combination.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	os_change_list (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/os_change_list', true, 'GET', payload);
	}
	/**
	 * Removes a private network from a server. The server will be automatically rebooted to complete the request.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @param {String} networkid Unique identifier for the private network to remove from this subscription. This field is optional if there is only one private network in a given location. See the v1/network/list call.
	 * @return {Promise}
	 */
	private_network_disable (subid, networkid) {
		let payload = {'SUBID' : subid, 'NETWORKID' : networkid };
		return this.rest.execute('/v1/server/private_network_disable', true, 'POST', payload);
	}
	/**
	 * Enables private networking on a server. The server will be automatically rebooted to complete the request. No action occurs if private networking was already enabled. It is possible to check whether or not private networking has been enabled with v1/server/list_ipv4.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @param {String} networkid Unique identifier for the private network to attach to this subscription.  This field is optional if there is only one private network in a given location.  See the v1/network/list call.
	 * @return {Promise}
	 */
	private_network_enable (subid, networkid) {
		let payload = {'SUBID' : subid, 'NETWORKID' : networkid };
		return this.rest.execute('/v1/server/private_network_enable', true, 'POST', payload);
	}
	/**
	 * List private networks attached to a particular server.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	private_networks (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/private_networks', true, 'GET', payload);
	}
	/**
	 * Reboot a virtual machine. This is a hard reboot (basically, unplugging the machine).
	 *
	 * @param {Integer} subid Unique identifier for this subscription.  These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	reboot (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/reboot', true, 'POST', payload);
	}
	/**
	 * Reinstall the operating system on a virtual machine. All data will be permanently lost, but the IP address will remain the same. There is no going back from this call.
	 *
	 * @param {Integer} subid Unique identifier for this subscription.  These can be found using the v1/server/list call.
	 * @param {String} hostname (optional) The hostname to assign to this server.
	 * @return {Promise}
	 */
	reinstall (subid, hostname) {
		let payload = {'SUBID' : subid };
		if(hostname !== undefined) { payload['hostname'] = hostname; }
		return this.rest.execute('/v1/server/reinstall', true, 'POST', payload);
	}
	/**
	 * Restore the specified backup to the virtual machine. Any data already on the virtual machine will be lost.
	 *
	 * @param {Integer} subid Unique identifier for this subscription.  These can be found using the v1/server/list call.
	 * @param {String} backupid BACKUPID (see v1/backup/list) to restore to this instance
	 * @return {Promise}
	 */
	restore_backup (subid, backupid) {
		let payload = {'SUBID' : subid, 'BACKUPID' : backupid };
		return this.rest.execute('/v1/server/restore_backup', true, 'POST', payload);
	}
	/**
	 * Restore the specified snapshot to the virtual machine. Any data already on the virtual machine will be lost.
	 *
	 * @param {Integer} subid Unique identifier for this subscription.  These can be found using the v1/server/list call.
	 * @param {String} snapshotid SNAPSHOTID (see v1/snapshot/list) to restore to this instance
	 * @return {Promise}
	 */
	restore_snapshot (subid, snapshotid) {
		let payload = {'SUBID' : subid, 'SNAPSHOTID' : snapshotid };
		return this.rest.execute('/v1/server/restore_snapshot', true, 'POST', payload);
	}
	/**
	 * Set a reverse DNS entry for an IPv4 address of a virtual machine to the original setting. Upon success, DNS changes may take 6-12 hours to become active.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @param {String} ip IPv4 address used in the reverse DNS update. These can be found with the v1/server/list_ipv4 call.
	 * @return {Promise}
	 */
	reverse_default_ipv4 (subid, ip) {
		let payload = {'SUBID' : subid, 'ip' : ip };
		return this.rest.execute('/v1/server/reverse_default_ipv4', true, 'POST', payload);
	}
	/**
	 * Remove a reverse DNS entry for an IPv6 address of a virtual machine. Upon success, DNS changes may take 6-12 hours to become active.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @param {String} ip IPv6 address used in the reverse DNS update. These can be found with the v1/server/reverse_list_ipv6 call.
	 * @return {Promise}
	 */
	reverse_delete_ipv6 (subid, ip) {
		let payload = {'SUBID' : subid, 'ip' : ip };
		return this.rest.execute('/v1/server/reverse_delete_ipv6', true, 'POST', payload);
	}
	/**
	 * List the IPv6 reverse DNS entries of a virtual machine. Reverse DNS entries are only available for virtual machines in the &quot;active&quot; state. If the virtual machine does not have IPv6 enabled, then an empty array is returned.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	reverse_list_ipv6 (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/reverse_list_ipv6', true, 'GET', payload);
	}
	/**
	 * Set a reverse DNS entry for an IPv4 address of a virtual machine. Upon success, DNS changes may take 6-12 hours to become active.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @param {String} ip IPv4 address used in the reverse DNS update. These can be found with the v1/server/list_ipv4 call.
	 * @param {String} entry reverse DNS entry.
	 * @return {Promise}
	 */
	reverse_set_ipv4 (subid, ip, entry) {
		let payload = {'SUBID' : subid, 'ip' : ip, 'entry' : entry };
		return this.rest.execute('/v1/server/reverse_set_ipv4', true, 'POST', payload);
	}
	/**
	 * Set a reverse DNS entry for an IPv6 address of a virtual machine. Upon success, DNS changes may take 6-12 hours to become active.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @param {String} ip IPv6 address used in the reverse DNS update. These can be found with the v1/server/list_ipv6 or v1/server/reverse_list_ipv6 calls.
	 * @param {String} entry reverse DNS entry.
	 * @return {Promise}
	 */
	reverse_set_ipv6 (subid, ip, entry) {
		let payload = {'SUBID' : subid, 'ip' : ip, 'entry' : entry };
		return this.rest.execute('/v1/server/reverse_set_ipv6', true, 'POST', payload);
	}
	/**
	 * Sets the user-data for this subscription. User-data is a generic data store, which some provisioning tools and cloud operating systems use as a configuration file. It is generally consumed only once after an instance has been launched, but individual needs may vary.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @param {String} userdata Base64 encoded user-data
	 * @return {Promise}
	 */
	set_user_data (subid, userdata) {
		let payload = {'SUBID' : subid, 'userdata' : userdata };
		return this.rest.execute('/v1/server/set_user_data', true, 'POST', payload);
	}
	/**
	 * Start a virtual machine. If the machine is already running, it will be restarted.
	 *
	 * @param {Integer} subid Unique identifier for this subscription.  These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	start (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/start', true, 'POST', payload);
	}
	/**
	 * Set the tag of a virtual machine.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @param {String} tag The tag to assign to this server. This tag is shown in the control panel.
	 * @return {Promise}
	 */
	tag_set (subid, tag) {
		let payload = {'SUBID' : subid, 'tag' : tag };
		return this.rest.execute('/v1/server/tag_set', true, 'POST', payload);
	}
	/**
	 * Upgrade the plan of a virtual machine. The virtual machine will be rebooted upon a successful upgrade.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @param {Integer} vpsplanid The new plan. See /v1/server/upgrade_plan_list.
	 * @return {Promise}
	 */
	upgrade_plan (subid, vpsplanid) {
		let payload = {'SUBID' : subid, 'VPSPLANID' : vpsplanid };
		return this.rest.execute('/v1/server/upgrade_plan', true, 'POST', payload);
	}
	/**
	 * Retrieve a list of the VPSPLANIDs for which a virtual machine can be upgraded. An empty response array means that there are currently no upgrades available.
	 *
	 * @param {Integer} subid Unique identifier for this subscription. These can be found using the v1/server/list call.
	 * @return {Promise}
	 */
	upgrade_plan_list (subid) {
		let payload = {'SUBID' : subid };
		return this.rest.execute('/v1/server/upgrade_plan_list', true, 'GET', payload);
	}
}
class Snapshot {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Create a snapshot from an existing virtual machine.  The virtual machine does not need to be stopped.
	 *
	 * @param {Integer} subid Identifier of the virtual machine to create a snapshot from.  See v1/server/list
	 * @param {String} description (optional) Description of snapshot contents
	 * @return {Promise}
	 */
	create (subid, description) {
		let payload = {'SUBID' : subid };
		if(description !== undefined) { payload['description'] = description; }
		return this.rest.execute('/v1/snapshot/create', true, 'POST', payload);
	}
	/**
	 * Destroy (delete) a snapshot. There is no going back from this call.
	 *
	 * @param {String} snapshotid Unique identifier for this snapshot.  These can be found using the v1/snapshot/list call.
	 * @return {Promise}
	 */
	destroy (snapshotid) {
		let payload = {'SNAPSHOTID' : snapshotid };
		return this.rest.execute('/v1/snapshot/destroy', true, 'POST', payload);
	}
	/**
	 * List all snapshots on the current account.
	 *
	 * @param {String} snapshotid (optional) Filter result set to only contain this snapshot.
	 * @return {Promise}
	 */
	list (snapshotid) {
		let payload = { };
		if(snapshotid !== undefined) { payload['SNAPSHOTID'] = snapshotid; }
		return this.rest.execute('/v1/snapshot/list', true, 'GET', payload);
	}
}
class SSHKey {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Create a new SSH Key.
	 *
	 * @param {String} name Name of the SSH key
	 * @param {String} ssh_key SSH public key (in authorized_keys format)
	 * @return {Promise}
	 */
	create (name, ssh_key) {
		let payload = {'name' : name, 'ssh_key' : ssh_key };
		return this.rest.execute('/v1/sshkey/create', true, 'POST', payload);
	}
	/**
	 * Remove a SSH key.  Note that this will not remove the key from any machines that already have it.
	 *
	 * @param {String} sshkeyid Unique identifier for this SSH key.  These can be found using the v1/sshkey/list call.
	 * @return {Promise}
	 */
	destroy (sshkeyid) {
		let payload = {'SSHKEYID' : sshkeyid };
		return this.rest.execute('/v1/sshkey/destroy', true, 'POST', payload);
	}
	/**
	 * List all the SSH keys on the current account.
	 *
	 * @return {Promise}
	 */
	list () {
		return this.rest.execute('/v1/sshkey/list', true, 'GET');
	}
	/**
	 * Update an existing SSH Key. Note that this will only update newly installed machines. The key will not be updated on any existing machines.
	 *
	 * @param {String} sshkeyid SSHKEYID of key to update (see /v1/sshkey/list)
	 * @param {String} name (optional) New name for the SSH key
	 * @param {String} ssh_key (optional) New SSH key contents
	 * @return {Promise}
	 */
	update (sshkeyid, name, ssh_key) {
		let payload = {'SSHKEYID' : sshkeyid };
		if(name !== undefined) { payload['name'] = name; }
		if(ssh_key !== undefined) { payload['ssh_key'] = ssh_key; }
		return this.rest.execute('/v1/sshkey/update', true, 'POST', payload);
	}
}
class StartupScript {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Create a startup script.
	 *
	 * @param {String} name Name of the newly created startup script
	 * @param {String} script Startup script contents
	 * @param {String} type boot|pxe Type of startup script.  Default is 'boot'
	 * @return {Promise}
	 */
	create (name, script, type) {
		let payload = {'name' : name, 'script' : script, 'type' : type };
		return this.rest.execute('/v1/startupscript/create', true, 'POST', payload);
	}
	/**
	 * Remove a startup script.
	 *
	 * @param {String} scriptid Unique identifier for this startup script.  These can be found using the v1/startupscript/list call.
	 * @return {Promise}
	 */
	destroy (scriptid) {
		let payload = {'SCRIPTID' : scriptid };
		return this.rest.execute('/v1/startupscript/destroy', true, 'POST', payload);
	}
	/**
	 * List all startup scripts on the current account. Scripts of type &quot;boot&quot; are executed by the server&#039;s operating system on the first boot. Scripts of type &quot;pxe&quot; are executed by iPXE when the server itself starts up.
	 *
	 * @return {Promise}
	 */
	list () {
		return this.rest.execute('/v1/startupscript/list', true, 'GET');
	}
	/**
	 * Update an existing startup script.
	 *
	 * @param {Integer} scriptid SCRIPTID of script to update (see /v1/startupscript/list)
	 * @param {String} name (optional) New name for the startup script
	 * @param {String} script (optional) New startup script contents
	 * @return {Promise}
	 */
	update (scriptid, name, script) {
		let payload = {'SCRIPTID' : scriptid };
		if(name !== undefined) { payload['name'] = name; }
		if(script !== undefined) { payload['script'] = script; }
		return this.rest.execute('/v1/startupscript/update', true, 'POST', payload);
	}
}
class UserManagement {
	/**
	 * @param {Rest} rest REST-interface 
	 */
	constructor(rest) {
		this.rest = rest;
	}
	/**
	 * Create a new user.
	 *
	 * @param {String} email Email address for this user
	 * @param {String} name Name for this user
	 * @param {Password} password for this user
	 * @param {String} api_enabled (optional) 'yes' or 'no'. If yes, this user's API key will work on api.vultr.com.  Default is yes
	 * @param {Array} acls List of ACLs that this user should have.  See /v1/user/list for information on possible ACLs
	 * @return {Promise}
	 */
	create (email, name, password, api_enabled, acls) {
		let payload = {'email' : email, 'name' : name, 'password' : password, 'acls' : acls };
		if(api_enabled !== undefined) { payload['api_enabled'] = api_enabled; }
		return this.rest.execute('/v1/user/create', true, 'POST', payload);
	}
	/**
	 * Delete a user.
	 *
	 * @param {Int} userid ID of the user to delete
	 * @return {Promise}
	 */
	delete (userid) {
		let payload = {'USERID' : userid };
		return this.rest.execute('/v1/user/delete', true, 'POST', payload);
	}
	/**
	 * Retrieve a list of any users associated with this account.
	 *
	 * @return {Promise}
	 */
	list () {
		return this.rest.execute('/v1/user/list', true, 'GET');
	}
	/**
	 * Update the details for a user.
	 *
	 * @param {String} userid ID of the user to update
	 * @param {String} email (optional) New email address for this user
	 * @param {String} name (optional) New name for this user
	 * @param {String} password (optional) New password for this user
	 * @param {String} api_enabled (optional) 'yes' or 'no'. If yes, this user's API key will work on api.vultr.com
	 * @param {Array} acls (optional) List of ACLs that this user should have.  See /v1/user/list for information on possible ACLs
	 * @return {Promise}
	 */
	update (userid, email, name, password, api_enabled, acls) {
		let payload = {'USERID' : userid };
		if(email !== undefined) { payload['email'] = email; }
		if(name !== undefined) { payload['name'] = name; }
		if(password !== undefined) { payload['password'] = password; }
		if(api_enabled !== undefined) { payload['api_enabled'] = api_enabled; }
		if(acls !== undefined) { payload['acls'] = acls; }
		return this.rest.execute('/v1/user/update', true, 'POST', payload);
	}
}


class Vultr {
	constructor(apiKey) {
		this.rest = new Rest(apiKey);
		this.account = new Account(this.rest);
		this.app = new Application(this.rest);
		this.auth = new APIKey(this.rest);
		this.backup = new Backup(this.rest);
		this.baremetal = new BareMetal(this.rest);
		this.block = new BlockStorage(this.rest);
		this.dns = new DNS(this.rest);
		this.firewall = new Firewall(this.rest);
		this.iso = new ISOImage(this.rest);
		this.os = new OperatingSystem(this.rest);
		this.plans = new Plans(this.rest);
		this.regions = new Regions(this.rest);
		this.reservedip = new ReservedIP(this.rest);
		this.server = new Server(this.rest);
		this.snapshot = new Snapshot(this.rest);
		this.sshkey = new SSHKey(this.rest);
		this.startupscript = new StartupScript(this.rest);
		this.user = new UserManagement(this.rest);
	}

	get apiKey() { return this.rest.apiKey; }
	set apiKey(apiKey) { this.rest.apiKey = apiKey; }
}


module.exports = Vultr;
