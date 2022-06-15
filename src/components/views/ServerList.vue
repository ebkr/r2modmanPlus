<template>

    <div class="tableview">

        <tr>
            <th :style="serverNameStyle()">Server Name</th>
            <th>PvP</th>
            <th># of Mods</th>
            <th>Password</th>
        </tr>

        <tr @click="openServerDetails()" v-for="item in data" class="inherit-background-colour tableview-row">

            <td :style="serverNameStyle()" class="tableview-cell">
                <strong>{{ item.name }}</strong>
            </td>

            <td class="tableview-cell centered">
                <div v-if="item.is_pvp" style="color: red">PvP</div>
                <div v-else style="color: green">PvE</div>
            </td>

            <td class="tableview-cell">
                {{ item.mods.length }}
            </td>

            <td class="tableview-cell centered">
                <icon v-if="item.requires_password" class="px-3"
                      icon-name="lock"
                      icon-size="xl"/>
            </td>

            <!--td class="tableview-cell">
                <icon class="px-3"
                      :icon-name="(item.isOnline ? 'circle-check' : 'circle-xmark')"
                      :icon-color="(item.isOnline ? '#00ff00' : '#aa0000')"
                />
            </td-->

        </tr>
    </div>

</template>


<script lang="ts">

import Icon from '../Icon.vue'
import {Component, Prop, Vue} from "vue-property-decorator";

@Component({
    components: {
        Icon
    }
})

export default class ServerList extends Vue {

    @Prop({required: false})
    private data!: Object;

    private openServerDetails() {
        alert('open server details clicked');
    }
    serverNameStyle() {
        return {width: "533px"};
    }
}
</script>
