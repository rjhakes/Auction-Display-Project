<template>
    <main class="addon_display">
        <h1 class="addon_display_header">Addon Buyers</h1>
        <div class="table_view">
        <table class="addon_display_table">
            <thead>
                <tr>
                    <th class="table_c1"></th>
                    <th class="table_c2"></th>
                    <th class="table_c3"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="buyers != null" v-for="b in buyers" :key="b">
                    <td>{{buyers[b].name }}</td>
                </tr>
            </tbody>
        </table>
        </div>
    </main>
</template>

<script>
    import{mapState, mapActions} from 'vuex'
    export default {
        data() {
            return{
                addonDisplaySpeed: 15000,   // Needs Testing
                buyers: []
            }
        },
        created: function() {
            setInterval(() => this.addonDisplaySpeed)
        }
    }
</script>

<css>
.addon_display_header {
    font-size: 45px;
    color: #339966;
    text-align: center;
    text-transform: uppercase; }

.addon_display_table {
    text-align: left;
    margin: 50px 10px;
    padding: 10px 15px;
    height: 90%
    width: 95%  }

    
</css>